import { useState } from 'react';
import { useCreateProductInquiry } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ProductInquiryFormProps {
  productId: bigint;
  entrepreneurId: bigint;
  onSuccess?: () => void;
}

export default function ProductInquiryForm({ productId, entrepreneurId, onSuccess }: ProductInquiryFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [message, setMessage] = useState('');

  const createInquiry = useCreateProductInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerContact.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createInquiry.mutateAsync({
        productId,
        entrepreneurId,
        customerName: customerName.trim(),
        customerContact: customerContact.trim(),
        message: message.trim(),
      });
      toast.success('Your inquiry has been sent!');
      setCustomerName('');
      setCustomerContact('');
      setMessage('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to send inquiry');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Seller</CardTitle>
        <CardDescription>Send a message to inquire about this product</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Your Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerContact">Contact Information</Label>
            <Input
              id="customerContact"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="Email or phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I'm interested in this product..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={createInquiry.isPending} className="w-full">
            {createInquiry.isPending ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
