export class Muscle {
  id: number;
  name: string;
  subGroup: string;
  group: string;
  popularName: string;
  description: string;

  constructor(
    id: number,
    name: string,
    subGroup: string,
    group: string,
    popularName: string,
    description: string
  ) {
    this.id = id;
    this.name = name;
    this.subGroup = subGroup;
    this.group = group;
    this.popularName = popularName;
    this.description = description;
  }

  static fromArray(data: string[]): Muscle {
    // Helper function to assign values
    const assignValue = (value: string, isId: boolean = false): any => {
      if (value === '-') {
        return null;
      }
      return isId ? parseInt(value, 10) : value;
    };

    // Assigning values through the static method
    const id = assignValue(data[0], true);
    const name = assignValue(data[1]);
    const subGroup = assignValue(data[2]);
    const group = assignValue(data[3]);
    const popularName = assignValue(data[4]);
    const description = assignValue(data[5]);

    return new Muscle(id, name, subGroup, group, popularName, description);
  }
}
