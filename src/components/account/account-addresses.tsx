'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building2,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Api } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';

interface Address {
  id: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export function AccountAddresses() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState({
    type: 'HOME' as 'HOME' | 'WORK' | 'OTHER',
    firstName: '',
    lastName: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    phone: '',
    isDefault: false,
  });

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'HOME':
        return <Home className="h-4 w-4" />;
      case 'WORK':
        return <Building2 className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const target = addresses.find(a => a.id === addressId);
      if (!target) return;
      await Api.updateCustomerAddress(addressId, { isDefault: true });
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })));
      toast.success('Default address updated');
    } catch (e) {
      toast.error('Failed to set default address');
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      const ok = await Api.deleteCustomerAddress(addressId);
      if (ok) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast.success('Address deleted');
      }
    } catch (e) {
      toast.error('Failed to delete address');
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await Api.getCustomerAddresses();
        setAddresses(data as any);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);

  const resetForm = () => {
    setForm({
      type: 'HOME',
      firstName: '',
      lastName: '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'South Africa',
      phone: '',
      isDefault: false,
    })
  }

  const openCreate = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const openEdit = (address: Address) => {
    setEditingAddress(address)
    setForm({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault,
    })
    setIsEditOpen(true)
  }

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const refreshAddresses = async () => {
    const data = await Api.getCustomerAddresses();
    setAddresses(data as any)
  }

  const handleCreate = async () => {
    try {
      const created = await Api.addCustomerAddress(form)
      if (created) {
        toast.success('Address added')
        setIsCreateOpen(false)
        await refreshAddresses()
      } else {
        toast.error('Failed to add address')
      }
    } catch (e) {
      toast.error('Failed to add address')
    }
  }

  const handleUpdate = async () => {
    if (!editingAddress) return
    try {
      const updated = await Api.updateCustomerAddress(editingAddress.id, form)
      if (updated) {
        toast.success('Address updated')
        setIsEditOpen(false)
        setEditingAddress(null)
        await refreshAddresses()
      } else {
        toast.error('Failed to update address')
      }
    } catch (e) {
      toast.error('Failed to update address')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading addresses...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Saved Addresses
              </CardTitle>
              <CardDescription>
                Manage your shipping and billing addresses
              </CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                 <div className="flex items-center gap-2">
                  {getAddressIcon(address.type)}
                  <div>
                    <CardTitle className="text-base capitalize">
                      {address.type.toLowerCase()} Address
                    </CardTitle>
                    {address.isDefault && (
                      <Badge variant="secondary" className="mt-1">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(address)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {!address.isDefault && (
                      <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                        <Home className="h-4 w-4 mr-2" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => handleDelete(address.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent>
                 <div className="space-y-2 text-sm">
                <div className="font-medium">
                  {address.firstName} {address.lastName}
                </div>
                
                 {address.company && (
                  <div className="text-muted-foreground">
                    {address.company}
                  </div>
                )}
                
                 <div className="text-muted-foreground">
                  {address.addressLine1}
                 </div>
                 {address.addressLine2 && (
                   <div className="text-muted-foreground">{address.addressLine2}</div>
                 )}
                
                 <div className="text-muted-foreground">
                  {address.city}, {address.province} {address.postalCode}
                 </div>
                
                <div className="text-muted-foreground">
                  {address.country}
                </div>
                
                 {address.phone && (
                  <div className="text-muted-foreground">
                    {address.phone}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(address)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                {!address.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set Default
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Address Card */}
        <Card onClick={openCreate} className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Add New Address</h3>
            <p className="text-sm text-muted-foreground text-center">
              Add a new shipping or billing address to your account
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Home className="h-4 w-4 mr-2" />
              Add Home Address
            </Button>
            <Button variant="outline" className="justify-start">
              <Building2 className="h-4 w-4 mr-2" />
              Add Work Address
            </Button>
            <Button variant="outline" className="justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Add Other Address
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Address Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>Save a shipping or billing address to your account.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Address Type</Label>
              <Select value={form.type} onValueChange={(v) => handleChange('type', v as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="WORK">Work</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>First Name</Label>
              <Input className="mt-1" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input className="mt-1" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Company (optional)</Label>
              <Input className="mt-1" value={form.company} onChange={(e) => handleChange('company', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Address Line 1</Label>
              <Input className="mt-1" value={form.addressLine1} onChange={(e) => handleChange('addressLine1', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Address Line 2 (optional)</Label>
              <Input className="mt-1" value={form.addressLine2} onChange={(e) => handleChange('addressLine2', e.target.value)} />
            </div>
            <div>
              <Label>City</Label>
              <Input className="mt-1" value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
            </div>
            <div>
              <Label>Province</Label>
              <Select value={form.province} onValueChange={(v) => handleChange('province', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                  <SelectItem value="Free State">Free State</SelectItem>
                  <SelectItem value="Gauteng">Gauteng</SelectItem>
                  <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                  <SelectItem value="Limpopo">Limpopo</SelectItem>
                  <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                  <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                  <SelectItem value="North West">North West</SelectItem>
                  <SelectItem value="Western Cape">Western Cape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input className="mt-1" value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} />
            </div>
            <div>
              <Label>Country</Label>
              <Input className="mt-1" value={form.country} onChange={(e) => handleChange('country', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Phone</Label>
              <Input className="mt-1" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <Checkbox checked={form.isDefault} onCheckedChange={(v) => handleChange('isDefault', Boolean(v))} id="default-create" />
              <Label htmlFor="default-create">Set as default for this type</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Save Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>Update your saved address details.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Address Type</Label>
              <Select value={form.type} onValueChange={(v) => handleChange('type', v as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="WORK">Work</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>First Name</Label>
              <Input className="mt-1" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input className="mt-1" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Company (optional)</Label>
              <Input className="mt-1" value={form.company} onChange={(e) => handleChange('company', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Address Line 1</Label>
              <Input className="mt-1" value={form.addressLine1} onChange={(e) => handleChange('addressLine1', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Address Line 2 (optional)</Label>
              <Input className="mt-1" value={form.addressLine2} onChange={(e) => handleChange('addressLine2', e.target.value)} />
            </div>
            <div>
              <Label>City</Label>
              <Input className="mt-1" value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
            </div>
            <div>
              <Label>Province</Label>
              <Select value={form.province} onValueChange={(v) => handleChange('province', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                  <SelectItem value="Free State">Free State</SelectItem>
                  <SelectItem value="Gauteng">Gauteng</SelectItem>
                  <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                  <SelectItem value="Limpopo">Limpopo</SelectItem>
                  <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                  <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                  <SelectItem value="North West">North West</SelectItem>
                  <SelectItem value="Western Cape">Western Cape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input className="mt-1" value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} />
            </div>
            <div>
              <Label>Country</Label>
              <Input className="mt-1" value={form.country} onChange={(e) => handleChange('country', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Phone</Label>
              <Input className="mt-1" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <Checkbox checked={form.isDefault} onCheckedChange={(v) => handleChange('isDefault', Boolean(v))} id="default-edit" />
              <Label htmlFor="default-edit">Set as default for this type</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
