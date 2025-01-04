import { Injectable } from '@angular/core';
import Database, { QueryResult } from '@tauri-apps/plugin-sql';
import { TestResult } from './models/test-result';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db: Database | undefined;
  private isInitialized = false; // Assurez-vous que la base de données est initialisée une seule fois.

  init(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve(); // Si déjà initialisé, ne rien faire
    }
    return Database.load('sqlite:mydatabase.db').then((db) => {
      console.log('Base de données initialisée !');
      this.db = db;
      this.isInitialized = true;
    });
  }

  close() {
    this.db?.close();
  }

  async get<T extends Record<string, any>>(query: string, ...params: any[]): Promise<T[]> {
    // Attendre l'initialisation avant la requête
    if (!this.isInitialized) {
      await this.init();
    }

    const result: T[] | undefined = params.length === 0 
      ? await this.db?.select(query) 
      : await this.db?.select(query, params);

    if (!result) {
      return [];
    }

    // Transformer les résultats en camelCase avec une fonction fléchée pour lier le contexte
    return result.map((item) => this.mapToCamelCase(item)) as T[];
  }

  /**
   * Convertit un objet contenant des clés en snake_case vers un objet avec des clés en camelCase.
   */
  private mapToCamelCase<T extends Record<string, any>>(data: T): T {
    const transformed: Record<string, any> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const camelKey = this.snakeToCamel(key);
        transformed[camelKey] = data[key];
      }
    }

    return transformed as T;
  }

  /**
   * Convertit une chaîne snake_case en camelCase.
   */
  private snakeToCamel(snake: string): string {
    return snake.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  async create<T>(obj: T, tableName: string): Promise<QueryResult | undefined>{
    // Assurez-vous que la base est initialisée avant d'ajouter un résultat
    if (!this.isInitialized) {
      await this.init();
    }
    const { query, values } = this.generateInsertQuery(tableName, obj);
    console.log(query, values);
    return await this.db?.execute(query, values);
  }

  async update<T>(obj: T, tableName: string){
    const { query, values } = this.generateUpdateQuery(tableName, obj);
    
    console.log(query, values);
    const result = await this.db?.execute(query, values);
    return result;
  }
  
  generateInsertQuery(tableName: string, obj: any) {
    const keys = Object.keys(obj)
      .filter((o) => o !== 'id') // Exclure la clé "id"
      .map((key) => key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`));

    // Transforme l'objet, en s'assurant que les dates sont bien converties
    const formattedObject: Record<string, any> = {
      ...obj,
      date: obj.date instanceof Date ? obj.date.getTime() : obj.date,
    };

    // Utilisation des clés d'origine pour extraire les valeurs correctes
    const originalKeys = Object.keys(obj).filter((o) => o !== 'id');
    const values = originalKeys.map((key) => formattedObject[key]);

    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;

    return { query, values };
  }

  generateUpdateQuery(tableName: string, obj: any) {
    // Formater l'objet : convertir les dates en timestamps si nécessaire
    const formattedObject: Record<string, any> = {
        ...obj,
        date: obj.date instanceof Date ? obj.date.getTime() : obj.date,
        flaky: typeof obj.flaky === 'boolean' ? (obj.flaky ? 1 : 0) : obj.flaky
    };

    // Filtrer les champs qui ne sont pas "id" et qui ne sont pas `undefined`
    const validKeys = Object.keys(formattedObject)
        .filter((key) => key !== 'id' && formattedObject[key] !== undefined);

    // Mapper les clés vers leur format SQL (snake_case) et construire la liste des valeurs
    const updateKeys = validKeys.map((key) =>
        key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    );

    const values = validKeys.map((key) => formattedObject[key]);
    values.push(obj.id); // Ajouter l'ID à la fin pour la clause WHERE

    // Construire la partie SET de la requête
    const update = updateKeys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const query = `UPDATE ${tableName} SET ${update} WHERE id = $${updateKeys.length + 1};`;
    return { query, values };
}

}
