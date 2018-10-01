import { Roles } from './roles.model';

export class SearchResult {
  public id: number;
  public name: string;
  public image: string;
  public roles: Roles;
  public q: string;
  public originalq: string;
  constructor(id: number, name:string, image:string, roles:Roles, q: string, originalq: string){
    this.id = id;
    this.name = name;
    this.image = image;
    this.roles = roles;
    this.q = q;
    this.originalq = originalq;
  }
}
