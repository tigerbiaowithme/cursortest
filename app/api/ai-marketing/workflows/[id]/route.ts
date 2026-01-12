import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import axios from 'axios';

// 简化的工作流存储（实际应该使用数据库）
let workflows: any[] = [];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const workflow = workflows.find((w) => w.id === params.id);
  
  if (!workflow) {
    return NextResponse.json(
      { error: 'Workflow not found' },
      { status: 404 }
    );
  }

  Object.assign(workflow, body);
  
  return NextResponse.json({ success: true, workflow });
}
