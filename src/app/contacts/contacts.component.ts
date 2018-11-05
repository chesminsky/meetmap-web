import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../_common/services/users.service';
import { CookieService } from 'ngx-cookie-service';
import { MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../_common/services/messages.service';
import { Socket } from 'socket.io';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public user$: any;
  private socket: Socket;

  @ViewChild('contacts')
  private contactsList: MatSelectionList;

  constructor(
    private contactsService: UsersService,
    private cookies: CookieService,
    private route: ActivatedRoute,
    private messages: MessagesService,
    private router: Router
  ) { }

  ngOnInit() {

    const userName = this.cookies.get('auth');

    this.user$ = this.contactsService.get(userName);

    this.socket = this.route.snapshot.data.socket;
  }

  public addToMap() {
    const selected = this.contactsList.selectedOptions.selected.map((o) => o.value);

    selected.forEach((c) => {
      this.socket.emit('invite', {name: c});

      this.messages.showMessage('Приглашение на карту отправлено');

      this.router.navigate(['map']);
    });
  }

}

