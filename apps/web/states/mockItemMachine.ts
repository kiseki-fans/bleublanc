import { createMachine, assign, spawn } from "xstate";

const createTodo = (title) => {
  return {
    id: uuid(),
    title,
    completed: false
  };
};

export const mockItemMachine = createMachine({
  id: "mockItem",
  initial: "notReady",
  states: {
    notReady: {
        on: {
            SYNCED: { target: 'inSync' },
            LOADED: { target: 'outOfSync' },
            MOCK_NOT_FOUND: { target: 'noMockFile' },
            NOT_RECORDED: { target: 'notRecorded' }
        }
    },
    notRecorded: {},
    noMockFile: {},
    inSync: {
        on: {
            LOADED: { target: 'outOfSync' },
            DELETE: { target: 'noMockFile' }
        }
    },
    outOfSync: {
        on: {
            SYNCED: { target: 'inSync' }
        }
    }
  },
  on: {
    "NEWTODO.CHANGE": {
      actions: assign({
        todo: (_, event) => event.value
      })
    },
    "NEWTODO.COMMIT": {
      actions: [
        assign({
          todo: "", // clear todo
          todos: (context, event) => {
            const newTodo = createTodo(event.value.trim());
            return context.todos.concat({
              ...newTodo,
              ref: spawn(createTodoMachine(newTodo))
            });
          }
        }),
        "persist"
      ],
      cond: (_, event) => event.value.trim().length
    },
    "TODO.COMMIT": {
      actions: [
        assign({
          todos: (context, event) =>
            context.todos.map((todo) => {
              return todo.id === event.todo.id
                ? { ...todo, ...event.todo, ref: todo.ref }
                : todo;
            })
        }),
        "persist"
      ]
    },
    "TODO.DELETE": {
      actions: [
        assign({
          todos: (context, event) =>
            context.todos.filter((todo) => todo.id !== event.id)
        }),
        "persist"
      ]
    },
    SHOW: {
      actions: assign({
        filter: (_, event) => event.filter
      })
    },
    "MARK.completed": {
      actions: (context) => {
        context.todos.forEach((todo) => todo.ref.send("SET_COMPLETED"));
      }
    },
    "MARK.active": {
      actions: (context) => {
        context.todos.forEach((todo) => todo.ref.send("SET_ACTIVE"));
      }
    },
    CLEAR_COMPLETED: {
      actions: assign({
        todos: (context) => context.todos.filter((todo) => !todo.completed)
      })
    }
  }
});
