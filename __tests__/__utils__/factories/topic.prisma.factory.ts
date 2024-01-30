export class TopicFactory {
    static build(props) {
      return {
        name: 'Default-Name',
        token: 'DEFAULTNAME',
        ...props,
      };
    }
  }

  export class getTopic {
    static build(props) {
      return {
        name: "NOMETESTE",
        page: 0,
        pageSize: 10,
        ...props,
      };
    }
  }
  