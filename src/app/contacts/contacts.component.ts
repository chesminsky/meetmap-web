import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactsService } from '../_common/services/contacts.service';
import { MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../_common/services/messages.service';
import { Socket } from 'socket.io';
import { UserService } from '../_common/services/user.service';
import { Observable } from 'rxjs';
import { NotificationsService } from '../_common/services/notifications.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public users$: Observable<Array<User>>;
  private socket: Socket;

  @ViewChild('contacts')
  private contactsList: MatSelectionList;

  constructor(
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private messages: MessagesService,
    private router: Router,
    private userService: UserService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {

    const userName = this.userService.model.name;

    this.users$ = this.contactsService.getAll();

    this.socket = this.route.snapshot.data.socket;
  }

  public addToMap() {
    const selected = this.contactsList.selectedOptions.selected.map((o) => o.value);

    selected.forEach((id) => {

      this.notifications.create({
        room: this.userService.model._id,
        userId: id
      }).toPromise().then(() => {
        this.messages.showMessage('Приглашение на карту отправлено');

        this.router.navigate(['map']);
      });
    });
  }

}

