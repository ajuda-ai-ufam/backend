export class ScheduleTopicFormatter {
  static formatScheduleTopicName(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => {
        let formatedString: string = word.charAt(0).toUpperCase();

        for (let i = 1; i < word.length; i++) {
          if (word[i - 1] == '-')
            formatedString = formatedString + word[i].toUpperCase();
          else formatedString = formatedString + word[i].toLowerCase();
        }

        return formatedString;
      })
      .join(' ');
  }

  static formatScheduleTopicToken(name: string): string {
    return name
      .toUpperCase()
      .replace(/\s/g, '')
      .replace(/[0-9]/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/_/g, '');
  }
}
