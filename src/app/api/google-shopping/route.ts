
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

export async function GET(req: NextRequest) {
  try {
    const productsSnapshot = await db.collection('products').where('status', '==', 'active').get();

    if (productsSnapshot.empty) {
      return new NextResponse('<error>No products found</error>', {
        status: 404,
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.shreevarma.org/';

    const xmlItems = productsSnapshot.docs.map(doc => {
      const product = doc.data();
      const id = doc.id;
      
      const availability = (product.inventoryQuantity ?? 0) > 0 ? 'in stock' : 'out of stock';

      return `
    <item>
      <g:id>${id}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description || '')}</g:description>
      <g:link>${appUrl}products/${id}</g:link>
      <g:image_link>${escapeXml(product.imageUrls?.[0] || '')}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${product.sellingPrice} INR</g:price>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      ${product.gtin ? `<g:gtin>${escapeXml(product.gtin)}</g:gtin>` : ''}
      <g:condition>new</g:condition>
    </item>`;
    }).join('');

    const xmlFeed = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Shreevarma's Wellness Product Feed</title>
    <link>${appUrl}</link>
    <description>Product feed for Shreevarma's Wellness.</description>
    ${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(xmlFeed, {
      status: 200,
      headers: { 'Content-Type': 'application/rss+xml' },
    });

  } catch (error: any) {
    console.error('[GOOGLE SHOPPING FEED ERROR]', error);
    return new NextResponse(`<error>Internal Server Error: ${error.message}</error>`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
