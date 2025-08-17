import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type User } from "@shared/schema";
import { auth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, User as UserIcon } from "lucide-react";

// Create update schema (subset of user schema for updates)
const updateUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

type UpdateUser = z.infer<typeof updateUserSchema>;

export default function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: auth.getCurrentUser,
  });

  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      preferredBroker: user?.preferredBroker || "",
      experience: user?.experience || "",
      bio: user?.bio || "",
      defaultRisk: user?.defaultRisk || 2.00,
      riskRewardRatio: user?.riskRewardRatio || "1:2",
      currency: user?.currency || "USD",
      emailNotifications: user?.emailNotifications ?? true,
      aiInsights: user?.aiInsights ?? true,
      weeklyReports: user?.weeklyReports ?? false,
      pushNotifications: user?.pushNotifications ?? true,
    },
  });

  // Update form when user data loads
  useState(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        preferredBroker: user.preferredBroker,
        experience: user.experience,
        bio: user.bio,
        defaultRisk: user.defaultRisk,
        riskRewardRatio: user.riskRewardRatio,
        currency: user.currency,
        emailNotifications: user.emailNotifications,
        aiInsights: user.aiInsights,
        weeklyReports: user.weeklyReports,
        pushNotifications: user.pushNotifications,
      });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUser) => {
      // Mock profile update - in a real app this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user data in localStorage
      if (user) {
        const updatedUser = { ...user, ...data, updatedAt: new Date() };
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error("User not found");
    },
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateUser) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-navy text-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-navy text-white pt-20">
      <div className="floating-elements"></div>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your account and trading preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <Card className="glass-morphism border-gray-600">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2" data-testid="text-user-name">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-400 mb-4">Trader</p>
                <Button variant="outline" className="btn-glass" data-testid="button-change-photo">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <Badge className="bg-electric-blue bg-opacity-20 text-electric-blue" data-testid="text-subscription">
                    {user?.subscription || 'Free'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Broker</span>
                  <span>{user?.preferredBroker || 'Not set'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="lg:col-span-2 glass-morphism border-gray-600">
            <CardHeader>
              <CardTitle className="text-xl">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="input-override"
                              data-testid="input-first-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="input-override"
                              data-testid="input-last-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="input-override"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredBroker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Preferred Broker</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="input-override" data-testid="select-broker">
                              <SelectValue placeholder="Select broker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="glass-morphism border-gray-600">
                            <SelectItem value="MetaTrader 4">MetaTrader 4</SelectItem>
                            <SelectItem value="TradingView">TradingView</SelectItem>
                            <SelectItem value="Interactive Brokers">Interactive Brokers</SelectItem>
                            <SelectItem value="TD Ameritrade">TD Ameritrade</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Trading Experience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="input-override" data-testid="select-experience">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="glass-morphism border-gray-600">
                            <SelectItem value="Beginner">Beginner (&lt; 1 year)</SelectItem>
                            <SelectItem value="Intermediate">Intermediate (1-3 years)</SelectItem>
                            <SelectItem value="Advanced">Advanced (3-5 years)</SelectItem>
                            <SelectItem value="Expert">Expert (&gt; 5 years)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            rows={4}
                            placeholder="Tell us about your trading journey..."
                            className="input-override"
                            data-testid="textarea-bio"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="btn-primary"
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-update-profile"
                  >
                    {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Trading Preferences */}
        <Card className="mt-6 glass-morphism border-gray-600">
          <CardHeader>
            <CardTitle className="text-xl">Trading Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Risk %</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="2.00"
                  className="input-override"
                  data-testid="input-default-risk"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred R:R Ratio</label>
                <Select defaultValue="1:2">
                  <SelectTrigger className="input-override" data-testid="select-risk-reward">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-morphism border-gray-600">
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="1:1.5">1:1.5</SelectItem>
                    <SelectItem value="1:2">1:2</SelectItem>
                    <SelectItem value="1:3">1:3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <Select defaultValue="USD">
                  <SelectTrigger className="input-override" data-testid="select-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-morphism border-gray-600">
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Notification Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-notifications" defaultChecked data-testid="checkbox-email-notifications" />
                  <label htmlFor="email-notifications" className="text-gray-300">
                    Email notifications for trade alerts
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ai-insights" defaultChecked data-testid="checkbox-ai-insights" />
                  <label htmlFor="ai-insights" className="text-gray-300">
                    AI insights and pattern recognition alerts
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="weekly-reports" data-testid="checkbox-weekly-reports" />
                  <label htmlFor="weekly-reports" className="text-gray-300">
                    Weekly performance summaries
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push-notifications" defaultChecked data-testid="checkbox-push-notifications" />
                  <label htmlFor="push-notifications" className="text-gray-300">
                    Mobile push notifications
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="mt-6 glass-morphism border-gray-600">
          <CardHeader>
            <CardTitle className="text-xl">Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Change Password</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    type="password"
                    placeholder="Current password"
                    className="input-override"
                    data-testid="input-current-password"
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    className="input-override"
                    data-testid="input-new-password"
                  />
                  <Button className="btn-primary" data-testid="button-update-password">
                    Update Password
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Add an extra layer of security to your account</p>
                    <p className="text-sm text-gray-400">
                      Status: <span className="text-green-400">Not Enabled</span>
                    </p>
                  </div>
                  <Button variant="outline" className="btn-glass" data-testid="button-enable-2fa">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
