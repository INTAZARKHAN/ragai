import { prisma } from "@/lib/prisma";

import type {
  AgentTask,
  TaskPriority,
  TaskStatus,
  TaskStep,
  TaskStepStatus,
  TaskType,
} from "./types";

interface CreateTaskInput {
  requestId: string;
  userId?: string;

  title: string;
  description: string;

  type: TaskType;
  priority?: TaskPriority;

  steps: Array<{
    order: number;
    description: string;
    tool?: string;
    input?: unknown;
  }>;
}

function mapStep(step: {
  id: string;
  order: number;
  description: string;
  tool: string | null;
  status: string;
  input: unknown;
  output: unknown;
  error: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
}): TaskStep {
  return {
    id: step.id,
    order: step.order,
    description: step.description,

    tool: step.tool ?? undefined,

    status: step.status as TaskStepStatus,

    input: step.input ?? undefined,

    result: step.output ?? undefined,

    error: step.error ?? undefined,

    startedAt: step.startedAt ?? undefined,

    completedAt: step.completedAt ?? undefined,
  };
}

function mapTask(task: {
  id: string;
  requestId: string;
  userId: string | null;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  steps: Array<{
    id: string;
    order: number;
    description: string;
    tool: string | null;
    status: string;
    input: unknown;
    output: unknown;
    error: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
  }>;
}): AgentTask {
  return {
    id: task.id,

    requestId: task.requestId,

    userId: task.userId ?? undefined,

    title: task.title,

    description: task.description,

    type: task.type as TaskType,

    priority: task.priority as TaskPriority,

    status: task.status as TaskStatus,

    steps: task.steps.map(mapStep),

    createdAt: task.createdAt,

    updatedAt: task.updatedAt,
  };
}

export async function createTask(
  input: CreateTaskInput
): Promise<AgentTask> {
  const task = await prisma.agentTask.create({
    data: {
      requestId: input.requestId,

      userId: input.userId,

      title: input.title,

      description: input.description,

      type: input.type,

      priority: input.priority ?? "NORMAL",

      status: "PENDING",

      steps: {
        create: input.steps.map((step) => ({
          order: step.order,

          description: step.description,

          tool: step.tool,

          input:
            step.input === undefined
              ? undefined
              : JSON.parse(
                  JSON.stringify(step.input)
                ),

          status: "PENDING",
        })),
      },
    },

    include: {
      steps: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return mapTask(task);
}

export async function getTaskById(
  taskId: string
): Promise<AgentTask | null> {
  const task = await prisma.agentTask.findUnique({
    where: {
      id: taskId,
    },

    include: {
      steps: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!task) {
    return null;
  }

  return mapTask(task);
}

export async function getTaskByRequestId(
  requestId: string
): Promise<AgentTask | null> {
  const task = await prisma.agentTask.findUnique({
    where: {
      requestId,
    },

    include: {
      steps: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!task) {
    return null;
  }

  return mapTask(task);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<AgentTask> {
  const task = await prisma.agentTask.update({
    where: {
      id: taskId,
    },

    data: {
      status,
    },

    include: {
      steps: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return mapTask(task);
}

export async function updateTaskStep(
  stepId: string,
  data: {
    status?: TaskStepStatus;
    output?: unknown;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
  }
): Promise<TaskStep> {
  const step = await prisma.agentTaskStep.update({
    where: {
      id: stepId,
    },

    data: {
      ...(data.status !== undefined && {
        status: data.status,
      }),

      ...(data.output !== undefined && {
        output: JSON.parse(
          JSON.stringify(data.output)
        ),
      }),

      ...(data.error !== undefined && {
        error: data.error,
      }),

      ...(data.startedAt !== undefined && {
        startedAt: data.startedAt,
      }),

      ...(data.completedAt !== undefined && {
        completedAt: data.completedAt,
      }),
    },
  });

  return mapStep(step);
}