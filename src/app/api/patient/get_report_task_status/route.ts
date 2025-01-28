import { NextRequest, NextResponse } from 'next/server';

const taskStatuses = new Map<string, number>();

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get('task_id');

  if (!taskId) {
    return NextResponse.json({ error: 'Missing task_id parameter' }, { status: 400 });
  }

  try {

    let attempts = taskStatuses.get(taskId) || 0;
    attempts++;
    taskStatuses.set(taskId, attempts);

    let status: string;
    if (attempts >= 3) {
      status = 'SUCCESS';
      taskStatuses.delete(taskId);
    } else {
      status = 'PROCESSING';
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ status }, { status: 200 });
  } catch (error) {
    console.error('Error processing task status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
