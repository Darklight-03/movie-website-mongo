import { Roles } from './roles.model';

export class SearchResult {
  public id: number;
  public name: string;
  public image: string;
  public roles: Roles;
  constructor(id: number, name:string, image:string, roles:Roles){
    this.id = id;
    this.name = name;
    this.image = image;
    this.roles = roles;
  }
}
