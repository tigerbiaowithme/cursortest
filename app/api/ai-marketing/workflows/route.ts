import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// 简化的工作流模型（实际应该创建Workflow模型）
let workflows: any[] = [];

export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  if (!user.permissions.aiMarketing) {
    return NextResponse.json(
      { error: 'Permission denied' },
      { status: 403 }
    );
  }

  return NextResponse.json({ workflows });
}

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  if (!user.permissions.aiMarketing) {
    return NextResponse.json(
      { error: 'Permission denied' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const newWorkflow = {
    id: Date.now().toString(),
    name: body.name,
    description: body.description,
    n8nWebhookUrl: body.n8nWebhookUrl,
    status: 'inactive' as const,
    createdAt: new Date().toISOString(),
  };

  workflows.push(newWorkflow);

  return NextResponse.json({ success: true, workflow: newWorkflow });
}
