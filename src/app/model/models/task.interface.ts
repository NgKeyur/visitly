export interface Task {
    id: number;
    title: string;
    userId?: number;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed'; 
    dueDate: string;  
    completed?: boolean;
    localOnly?: boolean;
  }
  
  export function convertToLocalTask(apiTask: any): Task {
    return {
      id: apiTask.id,
      userId: apiTask.userId,
      title: apiTask.title,
      description: apiTask.description || 'Description visitly',
      status: apiTask.completed ? 'Completed' : (apiTask.status || 'Pending'),
      dueDate: apiTask.dueDate || generateRandomDate(),
      completed: apiTask.completed,
      localOnly: false 
    };
  }
  
  export function convertToApiTask(localTask: Task): any {
    return {
      id: localTask.id,
      userId: localTask.userId,
      title: localTask.title,
      description: localTask.description,
      completed: localTask.status === 'Completed',
      status: localTask.status,
      dueDate: localTask.dueDate
    };
  }
  
  export function generateRandomDate(): string {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 20) + 1;
    const randomDate = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);
    return randomDate.toISOString().split('T')[0];
  }
  