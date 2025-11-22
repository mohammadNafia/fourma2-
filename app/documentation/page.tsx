"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Users, 
  Layout, 
  BarChart3, 
  Settings, 
  Key, 
  FileText, 
  Zap,
  Lock,
  Eye,
  Calendar,
  Download,
  Share2,
  Palette,
  Type,
  CheckSquare,
  Radio,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DocumentationPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete guide to using Flow Forum Builder. Learn how to create, manage, and use forms effectively.
        </p>
      </motion.div>

      {/* Admin Features */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Admin Features</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Layout className="h-5 w-5 text-primary" />
                <CardTitle>Form Builder</CardTitle>
              </div>
              <CardDescription>
                Create forms using our visual drag-and-drop builder
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Drag and drop form fields</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Multiple field types: text, email, number, date, etc.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Customize field labels and placeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Add validation rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Preview forms before publishing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Analytics & Reports</CardTitle>
              </div>
              <CardDescription>
                Monitor form performance and responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>View response statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Real-time response tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Export data to CSV/Excel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Response charts and graphs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Individual response details</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Access Management</CardTitle>
              </div>
              <CardDescription>
                Control who can access your forms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Generate unique access keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Set form closing dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Enable/disable forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Limit response count</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Track access history</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>Form Settings</CardTitle>
              </div>
              <CardDescription>
                Customize form appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Custom form titles and descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Theme customization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Required field indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Success message customization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Form templates library</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={() => router.push("/auth/login")} size="lg">
            Get Started as Admin
          </Button>
        </div>
      </motion.section>

      {/* User Features */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">User Features</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Key className="h-5 w-5 text-blue-500" />
                <CardTitle>Access Forms</CardTitle>
              </div>
              <CardDescription>
                Use access keys to open and fill forms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Enter 8-character access key</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Quick form access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>View form details before filling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Access validation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <CardTitle>Fill Forms</CardTitle>
              </div>
              <CardDescription>
                Simple and intuitive form filling experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Clean and simple interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Auto-save progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Field validation feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Mobile-responsive design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Submit confirmation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <CardTitle>Quick Actions</CardTitle>
              </div>
              <CardDescription>
                Efficient form management for users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>View all accessible forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Track submission history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Resume incomplete forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Form status indicators</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <CardTitle>Form Preview</CardTitle>
              </div>
              <CardDescription>
                Preview forms before submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>See all fields before filling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Understand form requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Check form status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>View closing dates</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => router.push("/auth/register")} 
            size="lg" 
            variant="outline"
            className="border-blue-500/50 hover:bg-blue-500/10"
          >
            Get Started as User
          </Button>
        </div>
      </motion.section>

      {/* Field Types */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-foreground">Available Field Types</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Type, name: "Text Input", desc: "Single-line text fields" },
            { icon: FileText, name: "Textarea", desc: "Multi-line text areas" },
            { icon: CheckSquare, name: "Checkbox", desc: "Multiple choice selection" },
            { icon: Radio, name: "Radio", desc: "Single choice selection" },
            { icon: ImageIcon, name: "File Upload", desc: "Upload documents/images" },
            { icon: Calendar, name: "Date Picker", desc: "Select dates easily" },
          ].map((field, idx) => (
            <Card key={idx} className="border-border/70 bg-card/80">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <field.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{field.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{field.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Getting Started */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-foreground">Getting Started</h2>
        <div className="space-y-4">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>For Admins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Sign in or create an admin account</li>
                <li>Navigate to the form builder</li>
                <li>Create a new form or use a template</li>
                <li>Add fields using drag-and-drop</li>
                <li>Configure form settings and access</li>
                <li>Generate an access key</li>
                <li>Publish the form</li>
                <li>Share the access key with users</li>
                <li>Monitor responses in the dashboard</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>For Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Get an access key from the admin</li>
                <li>Go to the home page</li>
                <li>Enter the 8-character access key</li>
                <li>Click "Open Form"</li>
                <li>Fill out all required fields</li>
                <li>Review your answers</li>
                <li>Submit the form</li>
                <li>Receive confirmation</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}

