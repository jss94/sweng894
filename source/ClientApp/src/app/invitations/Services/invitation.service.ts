import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvitationModel } from '../Models/invitation.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class InvitationService {
  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  getInvitation(eventId: string): Observable<InvitationModel> {
      return this.auth.get('invitation/' + eventId);
  }

  createNewInvitation(invitation: InvitationModel): Observable<any> {
    return this.auth.post('event/', invitation);
  }


  updateInvitation(invitation: InvitationModel): Observable<any> {
    return this.auth.put('invitation/', invitation);
  }

  deleteInvitation(invitation: InvitationModel): Observable<any> {
    return this.auth.delete('invitation/' + invitation.eventId);
  }

}
