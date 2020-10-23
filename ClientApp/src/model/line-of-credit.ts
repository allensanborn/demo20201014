// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from './base-entity';
import { Client } from './client';
import { Creditor } from './creditor';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class LineOfCredit extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  isSelected: boolean;
  /// </code>

  // Generated code. Do not place code below this line.
  lineOfCreditId: number;
  balance: number;
  clientId: number;
  creditorId: number;
  minPaymentPercentage: number;
  timestamp: any;
  client: Client;
  creditor: Creditor;
}

