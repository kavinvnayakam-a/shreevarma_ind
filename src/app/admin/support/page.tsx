
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send, MoreVertical, FileText, ShoppingBag, User, Inbox, UserCheck, Users, Archive, Clock, Paperclip } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const conversationsData = [
    {
        id: 1,
        name: 'Rohan Sharma',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjIyMjQ5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        lastMessage: 'Hi, I have a question about my recent order...',
        timestamp: '10m ago',
        unread: 1,
        status: 'unassigned',
        assignedTo: null,
        timer: '23:50:12 left'
    }
];

const messagesData: Record<number, any[]> = {
    1: [
        { sender: 'Rohan Sharma', text: 'Hi, I have a question about my recent order #ORD001.', time: '10:15 AM' },
    ],
};

const customerDetailsData: Record<number, any> = {
    1: {
        email: 'rohan.sharma@example.com',
        phone: '+91 98765 43210',
        orders: [
            { id: 'ORD001', status: 'Shipped' },
            { id: 'ORD-12345', status: 'Delivered' }
        ]
    }
};

const supportTeam = [
    { email: 'kavinvnayakam@gmail.com', name: 'Kavin', avatar: '/avatars/01.png' },
    { email: 'media@shreevarma.org', name: 'Shreevarma', avatar: '/avatars/02.png' },
];

export default function SupportDashboardPage() {
  const [conversations, setConversations] = useState(conversationsData);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [activeFilter, setActiveFilter] = useState('unassigned');

  const filteredConversations = conversations.filter(c => {
      if (activeFilter === 'me') return c.status === 'assigned' && c.assignedTo === 'kavinvnayakam@gmail.com';
      if (activeFilter === 'unassigned') return c.status === 'unassigned';
      if (activeFilter === 'assigned') return c.status === 'assigned';
      return c.status === activeFilter;
  });

  const handleSelectConversation = (id: number) => {
    const conversation = conversations.find(c => c.id === id);
    if(conversation) {
        setSelectedConversation(conversation);
    }
  }

  const handleAssign = (convoId: number, userEmail: string) => {
    setConversations(prev => prev.map(c => 
      c.id === convoId ? { ...c, status: 'assigned', assignedTo: userEmail } : c
    ));
    // In a real app, you'd also make an API call here.
  };

  return (
    <div className="flex h-[calc(100dvh-5rem)] bg-muted/40">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 hidden md:flex flex-col bg-card border-r">
          <div className="p-4 border-b">
              <h2 className="text-xl font-bold font-headline">Support Center</h2>
          </div>
          <nav className="p-2 space-y-1">
              <Button variant={activeFilter === 'unassigned' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('unassigned')} className="w-full justify-start"><Inbox className="mr-2"/> Unassigned</Button>
              <Button variant={activeFilter === 'me' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('me')} className="w-full justify-start"><UserCheck className="mr-2"/> Assigned to me</Button>
              <Button variant={activeFilter === 'all' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('assigned')} className="w-full justify-start"><Users className="mr-2"/> All</Button>
              <Button variant={activeFilter === 'closed' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('closed')} className="w-full justify-start"><Archive className="mr-2"/> Closed</Button>
          </nav>
      </div>

      {/* Middle Column - Conversations List */}
      <div className="w-full max-w-sm flex flex-col bg-background border-r">
        <div className="p-4 border-b">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredConversations.length > 0 ? filteredConversations.map((convo) => (
            <Card
              key={convo.id}
              onClick={() => handleSelectConversation(convo.id)}
              className={cn(
                  "m-2 cursor-pointer hover:bg-muted/50",
                  selectedConversation && selectedConversation.id === convo.id && 'bg-muted'
              )}
            >
                <CardContent className="p-3">
                    <div className="flex items-center gap-3 mb-2">
                         <Avatar className="h-10 w-10">
                            <AvatarImage src={convo.avatar} alt={convo.name} />
                            <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow overflow-hidden">
                            <p className="font-semibold truncate">{convo.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                            {convo.timestamp}
                            {convo.unread > 0 && <Badge className="mt-1 block">{convo.unread}</Badge>}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center mt-2 text-xs">
                        {convo.timer && (
                             <div className="flex items-center gap-1 text-red-600 font-medium">
                                <Clock className="w-3 h-3"/>
                                <span>{convo.timer}</span>
                            </div>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs h-7">
                                    {convo.assignedTo ? supportTeam.find(t=>t.email === convo.assignedTo)?.name : 'Assign'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {supportTeam.map(member => (
                                    <DropdownMenuItem key={member.email} onClick={() => handleAssign(convo.id, member.email)}>
                                        {member.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
              <Search className="w-12 h-12 mb-4"/>
              <p className="font-semibold">No Conversations</p>
              <p className="text-sm">No chats match the current filter.</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Column - Chat Window & Details */}
      <div className="flex-1 flex flex-col">
          {selectedConversation ? (
              <div className="flex-1 flex flex-row">
                  {/* Main Chat Window */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center p-4 border-b bg-card">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                        <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="font-bold">{selectedConversation.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><MoreVertical /></Button>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-6 bg-transparent">
                      <div className="space-y-4">
                        {(messagesData as any)[selectedConversation.id]?.map((msg: any, index: number) => (
                          <div key={index} className={cn('flex items-end gap-2 max-w-lg', msg.sender === 'Support Team' ? 'flex-row-reverse ml-auto' : 'mr-auto')}>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.sender === 'Support Team' ? undefined : selectedConversation.avatar} />
                              <AvatarFallback>{msg.sender === 'Support Team' ? 'S' : selectedConversation.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={cn('p-3 rounded-lg', msg.sender === 'Support Team' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none')}>
                              <p className="text-sm">{msg.text}</p>
                              <p className="text-xs mt-1 text-right opacity-70">{msg.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-card">
                      <div className="relative">
                        <Textarea placeholder="Type a message..." className="pr-24" rows={1} />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Button variant="ghost" size="icon">
                                <Paperclip className="w-5 h-5"/>
                            </Button>
                            <Button size="icon">
                                <Send />
                            </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Panel */}
                  <div className="w-full max-w-sm flex-col bg-card border-l hidden xl:flex">
                     <div className="p-4 border-b text-center">
                        <Avatar className="h-24 w-24 mx-auto">
                            <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                            <AvatarFallback className="text-3xl">{selectedConversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg mt-4">{selectedConversation.name}</h3>
                        <p className="text-sm text-muted-foreground">{customerDetailsData[selectedConversation.id]?.email}</p>
                     </div>
                     <ScrollArea className="flex-1">
                        <div className="p-4 space-y-4">
                            <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4"/> Contact Info</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                                    <p><strong>Email:</strong> {customerDetailsData[selectedConversation.id]?.email}</p>
                                    <p><strong>Phone:</strong> {customerDetailsData[selectedConversation.id]?.phone}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="p-4">
                                     <CardTitle className="text-base flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Order History</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-2">
                                    {customerDetailsData[selectedConversation.id]?.orders.length > 0 ? (
                                       customerDetailsData[selectedConversation.id].orders.map((order: any) => (
                                           <div key={order.id} className="text-sm border p-2 rounded-md">
                                               <Link href={`/profile/orders/${order.id.replace('ORD-', '')}`} className="font-semibold text-primary hover:underline">#{order.id}</Link>
                                               <div className="flex items-center gap-2">Status: <Badge variant={order.status === 'Shipped' ? 'secondary' : 'outline'}>{order.status}</Badge></div>
                                           </div>
                                       ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-2">No orders found.</p>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="p-4">
                                     <CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4"/> Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <Textarea placeholder="Add a note for this customer..." className="text-sm"/>
                                    <Button size="sm" className="mt-2">Save Note</Button>
                                </CardContent>
                            </Card>
                        </div>
                     </ScrollArea>
                  </div>
              </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center bg-muted/20">
                <div className="text-center text-muted-foreground">
                    <Search className="w-16 h-16 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold">Select a conversation</h3>
                    <p>Choose a chat from the left panel to start messaging.</p>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}
    
    