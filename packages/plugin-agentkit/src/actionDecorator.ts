export function CreateAction(options: {
  name: string;
  description: string;
  schema: any;
}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Store the action metadata
    if (!target.constructor.actions) {
      target.constructor.actions = [];
    }
    target.constructor.actions.push({
      name: options.name,
      description: options.description,
      schema: options.schema,
      method: propertyKey
    });
    return descriptor;
  };
} 