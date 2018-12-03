import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Socket } from 'socket.io';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public form: FormGroup;
  public messages: Array<{ sender: string; text: string; }> = [];
  public userName: string;
  public room: string;

  private socket: Socket;

  @ViewChild('message')
  private msgRef;

  ngOnInit() {

    this.socket = this.route.snapshot.data.socket;
    this.room = this.route.snapshot.paramMap.get('room');
    this.socket.emit('change_room', { room: this.room });

    this.form = this.fb.group({
      message: ''
    });

    this.socket.on('new_message', (data) => {
      this.messages.push({
        sender: data.name,
        text: data.message
      });
    });
  }

  public onSubmit() {

    const text = this.form.get('message').value;

    if (text) {
      this.socket.emit('new_message', { message: text, room: this.room });
      this.form.reset();
      this.msgRef.nativeElement.focus();
    }
  }


}
