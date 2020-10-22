// tslint:disable:no-trailing-whitespace
// tslint:disable:member-ordering
import { BaseEntity } from './base-entity';
import { LineOfCredit } from './line-of-credit';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Client extends BaseEntity  {

  /// <code> Place custom code between <code> tags
  
  /// </code>

  // Generated code. Do not place code below this line.
  clientId: number;
  firstName: string;
  lastName: string;
  timestamp: any;
  linesOfCredit: LineOfCredit[];
}

