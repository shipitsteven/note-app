class Note {
    id: string;
    name: string;
    tags: Array<string>;
    date_created: string;
    date_edited: string;

    constructor(name: string, tags: Array<string>) {
        this.name = name;
        this.tags = tags;
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.date_created = Date.now().toString();
        this.date_edited = Date.now().toString();
    }

    update_tags(tags: Array<string>): void {
        tags.forEach(tag => {
            this.tags.push(tag);
        });
    }

    update_date(): void {
        this.date_edited = Date.now().toString();
    }
}

export {Note}