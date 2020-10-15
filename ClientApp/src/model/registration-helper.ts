import { MetadataStore } from 'breeze-client';

import { Client } from './client';
import { Creditor } from './creditor';
import { LineOfCredit } from './line-of-credit';

export class LineOfCreditRegistrationHelper {

    static register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('Client', Client);
        metadataStore.registerEntityTypeCtor('Creditor', Creditor);
        metadataStore.registerEntityTypeCtor('LineOfCredit', LineOfCredit);
    }
}
