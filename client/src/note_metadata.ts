interface Metadata {
    update_tags(tags: Array<string>): void;
    update_date(): void;
    get_date(): string;
}

class NoteMetadata implements Metadata {
    id: string;
    tags: Array<string>;
    date_created: string;
    date_edited: string;

    constructor(id: string, tags: Array<string>) {
        this.id = id;
        this.tags = tags;
        this.date_created = this.get_date();
        this.date_edited = this.get_date();
    }

    update_tags(tags: Array<string>): void {
        tags.forEach(tag => {
            this.tags.push(tag);
        });
    }

    update_date(): void {
        this.date_edited = this.get_date();
    }

    get_date(): string {
        return new Date().toISOString();
    }
}

export {NoteMetadata}