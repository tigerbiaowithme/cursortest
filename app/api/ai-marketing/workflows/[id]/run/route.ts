import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import axios from 'axios';

// 简化的工作流存储（实际应该使用数据库）
let workflows: any[] = [];

export async function POST(
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

  const workflow = workflows.find((w) => w.id === params.id);
  
  if (!workflow) {
    return NextResponse.json(
      { error: 'Workflow not found' },
      { status: 404 }
    );
  }

  if (!workflow.n8nWebhookUrl) {
    return NextResponse.json(
      { error: 'Workflow webhook URL not configured' },
      { status: 400 }
    );
  }

  try {
    // 调用n8n webhook（不暴露n8n标识）
    const response = await axios.post(workflow.n8nWebhookUrl, {
      triggeredBy: 'AI营销宝',
      timestamp: new Date().toISOString(),
    });

    workflow.lastRun = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      message: '工作流已成功运行',
      result: response.data,
    });
  } catch (error: any) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
