
import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <Image
      src="https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Logo-Header-shreevarma.webp?alt=media&token=b45b375e-2760-4965-8f31-68c5de2387e3"
      alt="Shreevarma's Wellness Logo"
      width={180}
      height={50}
      className={props.className}
      style={{ objectFit: 'contain' }}
      priority
    />
  );
}
