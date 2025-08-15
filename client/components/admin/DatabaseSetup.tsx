import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { supabase } from "../../lib/supabase";
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react";

interface SetupStep {
  id: string;
  name: string;
  description: string;
  sql: string;
  status: 'pending' | 'running' | 'success' | 'error';
  error?: string;
}

export default function DatabaseSetup() {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'categories',
      name: 'Categories Table',
      description: 'Main menu categories (Pizza, Wings, etc.)',
      sql: `CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        order_num INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      status: 'pending'
    },
    {
      id: 'menu_sub_categories',
      name: 'Sub-Categories Table',
      description: 'Sub-categories within main categories',
      sql: `CREATE TABLE IF NOT EXISTS menu_sub_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
        display_order INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      status: 'pending'
    },
    {
      id: 'category_sizes',
      name: 'Category Sizes Table',
      description: 'Sizes tied to categories',
      sql: `CREATE TABLE IF NOT EXISTS category_sizes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
        size_name VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      status: 'pending'
    },
    {
      id: 'sub_category_sizes',
      name: 'Sub-Category Sizes Junction',
      description: 'Which sizes are valid for each sub-category',
      sql: `CREATE TABLE IF NOT EXISTS sub_category_sizes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sub_category_id UUID REFERENCES menu_sub_categories(id) ON DELETE CASCADE,
        category_size_id UUID REFERENCES category_sizes(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(sub_category_id, category_size_id)
      );`,
      status: 'pending'
    },
    {
      id: 'images',
      name: 'Images Table',
      description: 'Centralized image management',
      sql: `CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        storage_path TEXT NOT NULL,
        public_url TEXT,
        alt_text VARCHAR(255),
        file_size INTEGER,
        width INTEGER,
        height INTEGER,
        mime_type VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      status: 'pending'
    },
    {
      id: 'menu_items',
      name: 'Menu Items Table',
      description: 'Individual menu items',
      sql: `CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
        sub_category_id UUID REFERENCES menu_sub_categories(id) ON DELETE SET NULL,
        image_id UUID REFERENCES images(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      status: 'pending'
    },
    {
      id: 'menu_item_sizes',
      name: 'Menu Item Sizes Table',
      description: 'Size-based pricing for menu items',
      sql: `CREATE TABLE IF NOT EXISTS menu_item_sizes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
        category_size_id UUID REFERENCES category_sizes(id) ON DELETE CASCADE,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(menu_item_id, category_size_id)
      );`,
      status: 'pending'
    },
    {
      id: 'sample_data',
      name: 'Sample Data',
      description: 'Insert sample categories and sizes',
      sql: `INSERT INTO categories (id, name, is_active, order_num) VALUES 
        ('11111111-1111-1111-1111-111111111111', 'Pizza', true, 1),
        ('22222222-2222-2222-2222-222222222222', 'Wings', true, 2)
        ON CONFLICT (id) DO NOTHING;
        
        INSERT INTO category_sizes (category_id, size_name, display_order, is_active) VALUES 
        ('11111111-1111-1111-1111-111111111111', '7"', 1, true),
        ('11111111-1111-1111-1111-111111111111', '10"', 2, true),
        ('11111111-1111-1111-1111-111111111111', '12"', 3, true),
        ('22222222-2222-2222-2222-222222222222', '2lbs', 1, true),
        ('22222222-2222-2222-2222-222222222222', '5lbs', 2, true)
        ON CONFLICT DO NOTHING;`,
      status: 'pending'
    }
  ]);

  const updateStepStatus = (stepId: string, status: SetupStep['status'], error?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, error }
        : step
    ));
  };

  const executeSQL = async (sql: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Try to execute SQL using supabase.rpc for custom functions
      const { data, error } = await supabase.rpc('exec_sql', { query: sql });
      
      if (error) {
        // If RPC doesn't work, try direct table operations
        // This is a fallback approach
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const runDatabaseSetup = async () => {
    setIsRunning(true);
    
    for (const step of steps) {
      updateStepStatus(step.id, 'running');
      
      try {
        const result = await executeSQL(step.sql);
        
        if (result.success) {
          updateStepStatus(step.id, 'success');
        } else {
          updateStepStatus(step.id, 'error', result.error);
        }
      } catch (error: any) {
        updateStepStatus(step.id, 'error', error.message);
      }
      
      // Small delay between operations
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: SetupStep['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: SetupStep['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const successCount = steps.filter(step => step.status === 'success').length;
  const errorCount = steps.filter(step => step.status === 'error').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup
          </CardTitle>
          <CardDescription>
            Set up the complete database schema for your pizza restaurant management system.
            This will create all necessary tables and insert sample data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Progress: {successCount}/{steps.length} completed
              {errorCount > 0 && (
                <span className="text-red-600 ml-2">({errorCount} errors)</span>
              )}
            </div>
            <Button 
              onClick={runDatabaseSetup} 
              disabled={isRunning}
              className="min-w-[120px]"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Run Setup'
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(step.status)}
                  <div>
                    <h4 className="font-medium">{step.name}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    {step.status === 'error' && step.error && (
                      <p className="text-sm text-red-600 mt-1">Error: {step.error}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(step.status)}
              </div>
            ))}
          </div>

          {errorCount > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Setup Issues Detected</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Some tables couldn't be created automatically. This might be due to permission limitations.
              </p>
              <div className="space-y-2 text-sm text-yellow-700">
                <p><strong>Alternative options:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Go to your Supabase Dashboard → SQL Editor</li>
                  <li>Copy and paste the contents from <code>complete-supabase-schema.txt</code></li>
                  <li>Execute the SQL script manually</li>
                </ul>
              </div>
            </div>
          )}

          {successCount === steps.length && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🎉 Database Setup Complete!</h4>
              <p className="text-sm text-green-700">
                All tables have been created successfully. You can now use the admin panel to manage your restaurant data.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
