export abstract class ActionProvider<T> {
  constructor(
    public readonly name: string,
    public readonly actions: any[]
  ) {}
} 