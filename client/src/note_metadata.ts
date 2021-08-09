class Note_metadata {
    id: string;
    name: string;
    tags: Array<string>;
    date_created: string;
    date_edited: string;

    constructor(name: string, tags: Array<string>) {
        this.name = name;
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
        return new Date().toString();
    }
}

export {Note_metadata}