import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'EnumValidator', async: false })
export class EnumValidator implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const enumValues = Object.values(args.constraints[0]);
    const arrayValue = Array.of(...value);
    return arrayValue.every((element) => enumValues.includes(element));
  }

  defaultMessage() {
    return `Each value must be a valid enum value`;
  }
}
