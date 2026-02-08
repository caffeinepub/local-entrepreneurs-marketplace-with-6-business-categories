import { useState, useEffect } from 'react';
import { useGetCategories, useCreateOrUpdateProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { EntrepreneurProfile } from '../../backend';

interface SellerProfileFormProps {
  existingProfile: EntrepreneurProfile | null;
  onProfileCreated: (profile: EntrepreneurProfile) => void;
}

export default function SellerProfileForm({ existingProfile, onProfileCreated }: SellerProfileFormProps) {
  const [businessName, setBusinessName] = useState('');
  const [contact, setContact] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const { data: categories } = useGetCategories();
  const createOrUpdate = useCreateOrUpdateProfile();

  useEffect(() => {
    if (existingProfile) {
      setBusinessName(existingProfile.businessName);
      setContact(existingProfile.contact);
      setCategoryId(existingProfile.category.id.toString());
      setDescription(existingProfile.description);
    }
  }, [existingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim() || !contact.trim() || !categoryId || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const profile = await createOrUpdate.mutateAsync({
        businessName: businessName.trim(),
        contact: contact.trim(),
        categoryId: BigInt(categoryId),
        description: description.trim(),
      });
      toast.success(existingProfile ? 'Profile updated successfully!' : 'Profile created successfully!');
      onProfileCreated(profile);
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your business name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contact Information</Label>
        <Input
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Email or phone number"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id.toString()} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell customers about your business..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={createOrUpdate.isPending} className="w-full">
        {createOrUpdate.isPending ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
      </Button>
    </form>
  );
}
