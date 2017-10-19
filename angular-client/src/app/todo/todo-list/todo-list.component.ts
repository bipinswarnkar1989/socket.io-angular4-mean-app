// ./angular-client/src/app/todo/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';

import { TodoService } from '../todo.service';

import io from "socket.io-client";


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos:any[] = [];
  todo:any = {};
  todoToEdit:any = {};
  todoToDelete:any = {};
  fetchingData:boolean = false;
  apiMessage:string;

  private url = 'http://localhost:3001';
  private socket;

  constructor(private todoService:TodoService) { }

  ngOnInit(): void {
    this.todoService.showAddTodoBox = true;
    this.todoService.getTodos()
                    .then(td => this.todos = td.todos );
    this.socket = io.connect(this.url);
    // Receive Added Todo
    this.socket.on('TodoAdded', (data) => {
      console.log('TodoAdded: '+JSON.stringify(data));
      this.todos.push(data.todo);
    });
    //Receive Updated Todo
    this.socket.on('TodoUpdated', (data) => {
      console.log('TodoUpdated: '+JSON.stringify(data));
      const updatedTodos = this.todos.map(t => {
          if(data.todo._id !== t._id){
            return t;
          }
          return { ...t, ...data.todo };
        })
        this.apiMessage = data.message;
        this.todos = updatedTodos;
    });
    //Receive Deleted Todo and remove it from liste
    this.socket.on('TodoDeleted', (data) => {
      console.log('TodoDeleted: '+JSON.stringify(data));
      const filteredTodos = this.todos.filter(t => t._id !== data.todo._id);
      this.apiMessage = data.message;
      this.todos = filteredTodos;
    });
  }

  AddTodo(todo:any):void{
    if(!todo){ return; }
    this.todoService.createTodo(todo,this.socket);
  }

  showEditTodo(todo:any):void{
    this.todoToEdit = todo;
    this.apiMessage = "";
  }

  EditTodo(todo:any):void{
    if(!todo){ return; }
    todo.id = this.todoToEdit._id;
    this.todoService.updateTodo(todo,this.socket);
  }

 showDeleteTodo(todo:any):void{
   this.todoToDelete = todo;
   this.apiMessage = "";
 }

 DeleteTodo(todo:any):void{
   if(!todo){ return; }
   this.todoService.deleteTodo(todo,this.socket);
 }

}
