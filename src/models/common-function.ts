import { Model, ModelStatic, WhereOptions } from "sequelize";

class CommonFunctions<T extends Model> {
  model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  // Get all records
  async getAll(options: object = {}) {
    return await this.model.findAll(options);
  }

  // Get a single record by ID
  async getById(id: number) {
    return await this.model.findByPk(id);
  }

  // Store (Create) a new record
  async store(data: object) {
    return await this.model.create(data as any);
  }

  // Modify (Update) an existing record
  async modify(id: number, data: object) {
    const record = await this.getById(id);
    if (!record) throw new Error("Record not found");
    return await record.update(data);
  }

  // Remove (Delete) a record by ID
  async remove(id: number) {
    const record = await this.getById(id);
    if (!record) throw new Error("Record not found");
    return await record.destroy();
  }

  // Search records by any field
  async search(query: WhereOptions<T>) {
    return await this.model.findAll({ where: query });
  }

  // Count total records
  async count(query: WhereOptions<T> = {}) {
    return await this.model.count({ where: query });
  }
}

export default CommonFunctions;
