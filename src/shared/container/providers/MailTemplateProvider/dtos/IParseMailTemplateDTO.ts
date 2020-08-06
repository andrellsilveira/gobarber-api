interface ITemplateVariables {
    /**
     * Possibilita a criação de atributos dinâmicos, onde o nome do atributo deve ser uma
     * string e seu tipo pode ser string ou number
     */
    [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
    file: string;
    variables: ITemplateVariables;
}
