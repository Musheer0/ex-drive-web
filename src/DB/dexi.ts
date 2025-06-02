import { DexiSession, Media } from '@/lib/type';
import { toDexieSchemaFromZod } from '@/lib/utils';
import { fileSchema } from '@/validators/media_validator';
import Dexie, { type EntityTable } from 'dexie';



const db = new Dexie("cacheDB") as Dexie & {
    media: EntityTable<Media, 'id'>;
    sessions: EntityTable<DexiSession, 'id'>;
};

db.version(3).stores({
    media: toDexieSchemaFromZod(fileSchema, false),
    sessions: '++id, email, image,token', // auto-increment ID
});

export { db };
