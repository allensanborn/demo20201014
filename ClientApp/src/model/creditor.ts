// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from './base-entity';
import { Client } from './client';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Creditor extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  creditorId: number;
  name: string;
  timestamp: any;
  clients: Client[];
}

