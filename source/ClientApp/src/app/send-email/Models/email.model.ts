import { EmailAddress } from './email.address.model';
import { EmailContent } from './email.content.model';

export class EmailModel {
  public personalizations: [
    {
      to: EmailAddress[];
    }
  ];
  public from: EmailAddress;
  public subject: string;
  public content: EmailContent[];
}
