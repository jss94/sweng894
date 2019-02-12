export class EmailModel {
  public personalizations: [
    {
      to: [{
        email: string;
      }]
    }
  ];
  public from: string;
  public subject: string;
  public content: [{
    type: string;
    value: string;
  }];
}
