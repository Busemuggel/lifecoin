import * as mongoose from 'mongoose'

interface ITodo {
  title: string,
  description: string
}

interface TodoModelInterface extends mongoose.Model<TodoDoc> {
  build(attr: ITodo) : TodoDoc
}

interface TodoDoc extends mongoose.Document {
  title: string,
  description: string
}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr)
}

const Todo = mongoose.model<any, TodoModelInterface>('Todo', todoSchema)

export { Todo }