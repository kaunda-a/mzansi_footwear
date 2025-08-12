'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Star
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Api } from '@/lib/api';
import { toast } from 'sonner';

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

export function AccountProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    address: {
      street: '',
      city: '',
      province: 'Gauteng',
      postalCode: '',
      country: 'South Africa'
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true,
      language: 'en',
      currency: 'ZAR'
    }
  });

  React.useEffect(() => {
    async function load() {
      try {
        const customer = await Api.getCurrentCustomerProfile();
        if (customer) {
          setProfileData(prev => ({
            ...prev,
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            email: customer.email || session?.user?.email || '',
            phone: customer.phone || '',
          }))
        } else {
          setProfileData(prev => ({
            ...prev,
            email: session?.user?.email || '',
            firstName: session?.user?.name?.split(' ')[0] || '',
            lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
          }))
        }
      } finally {
        setLoadingProfile(false)
      }
    }
    load()
  }, [session])

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updated = await Api.updateCustomerProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
      });
      if (updated) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setProfileData({
      firstName: session?.user?.name?.split(' ')[0] || '',
      lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
      email: session?.user?.email || '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      bio: '',
      address: {
        street: '',
        city: '',
        province: 'Gauteng',
        postalCode: '',
        country: 'South Africa'
      },
      preferences: {
        newsletter: true,
        smsNotifications: false,
        emailNotifications: true,
        language: 'en',
        currency: 'ZAR'
      }
    });
    setIsEditing(false);
  };

  if (loadingProfile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading profile...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Manage your personal details and preferences
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="text-lg font-bold">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-muted-foreground">{profileData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verified Account
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Premium Member
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder="+27 XX XXX XXXX"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={profileData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              placeholder="Tell us a bit about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
          <CardDescription>
            Your primary address for shipping and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={profileData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                disabled={!isEditing}
                placeholder="123 Main Street"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profileData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                disabled={!isEditing}
                placeholder="Johannesburg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Select
                value={profileData.address.province}
                onValueChange={(value) => handleInputChange('address.province', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SA_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={profileData.address.postalCode}
                onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                disabled={!isEditing}
                placeholder="2000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profileData.address.country}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
