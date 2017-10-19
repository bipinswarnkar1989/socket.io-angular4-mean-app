// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class TodoService {
  private apiUrl = 'http://localhost:3001/api/';
  showAddTodoBox:boolean = true;

  constructor(private http: Http){ }

  getTodos(): Promise<any>{
      return this.http.get(this.apiUrl)
                 .toPromise()
                 .then(this.handleData)
                 .catch(this.handleError)
  }

  getTodo(id:string): Promise<any>{
    return this.http.get(this.apiUrl + id)
                    .toPromise()
                    .then(this.handleData)
                    .catch(this.handleError)
  }

  createTodo(todo:any,socket:any): void{
    socket.emit('addTodo', todo);
  }

  updateTodo(todo:any,socket:any):void{
    socket.emit('updateTodo', todo);
  }

  deleteTodo(todo:any,socket:any):void{
    socket.emit('deleteTodo', todo);
  }

  private handleData(res: any) {
       let body = res.json();
       console.log(body); // for development purposes only
       return body || {};
   }

 private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for development purposes only
     return Promise.reject(error.message || error);
 }

}
