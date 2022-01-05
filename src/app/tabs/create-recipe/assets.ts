export interface Medida{
    Name: string,
    Short: string,
}

export interface CustomIcon {
    Display: string,
    Source: string,
}
export const foodIcons: CustomIcon[] = [
    {Display: '?', Source: 'help'},
    {Display: 'Agua', Source: 'food-agua'},
    {Display: 'Ajo', Source: 'food-ajo'},
    {Display: 'Alcohol', Source: 'food-alcohol'},
    {Display: 'Berenjena', Source: 'food-berenjena'},
    {Display: 'Brocoli', Source: 'food-brocoli'},
    {Display: 'Calabaza', Source: 'food-calabaza'},
    {Display: 'Carne', Source: 'food-carne'},
    {Display: 'Cereza', Source: 'food-cereza'},
    {Display: 'Chile', Source: 'food-chile'},
    {Display: 'Fresa', Source: 'food-fresa'},
    {Display: 'Hoja', Source: 'food-hoja'},
    {Display: 'Hongo', Source: 'food-hongo'},
    {Display: 'Huevo', Source: 'food-huevo'},
    {Display: 'Limón', Source: 'food-limon'},
    {Display: 'Líquido', Source: 'food-liquido'},
    {Display: 'Maíz', Source: 'food-maiz'},
    {Display: 'Manzana', Source: 'food-manzana'},
    {Display: 'Naranja', Source: 'food-naranja'},
    {Display: 'Pan', Source: 'food-pan'},
    {Display: 'Péz', Source: 'food-pez'},
    {Display: 'Pimiento', Source: 'food-pimiento'},
    {Display: 'Plátano', Source: 'food-platano'},
    {Display: 'Pollo', Source: 'food-pollo'},
    {Display: 'Queso', Source: 'food-queso'},
    {Display: 'Rábano', Source: 'food-rabano'},
    {Display: 'Salsa', Source: 'food-salsa'},
    {Display: 'Sandía', Source: 'food-sandia'},
    {Display: 'Tomate', Source: 'food-tomate'},
    {Display: 'Uva', Source: 'food-uva'},
    {Display: 'Zanahoria', Source: 'food-zanahoria'},
];

export const kitchenIcons: CustomIcon[] = [
    {Display: '?', Source: 'help'},
    {Display: 'Cazuela', Source: 'kitchen-cazuela'},
    {Display: 'Horno', Source: 'kitchen-horno'},
    {Display: 'Licuadora', Source: 'kitchen-licuadora'},
    {Display: 'Mezclador', Source: 'kitchen-mezclador'},
    {Display: 'Microondas', Source: 'kitchen-microondas'},
    {Display: 'Olla', Source: 'kitchen-olla'},
    {Display: 'Parrilla', Source: 'kitchen-parrilla'},
    {Display: 'Refrigerador', Source: 'kitchen-refrigerador'},
];

export const Medidas: Medida[] = [
    {Name: 'Unidades', Short: 'u'},
    {Name: 'Miligramos', Short: 'mg'},
    {Name: 'Gramos', Short: 'gr'},
    {Name: 'Kilogramos', Short: 'kg'},
    {Name: 'Mililitros', Short: 'ml'},
    {Name: 'Litros', Short: 'L'},
    {Name: 'Tazas', Short: ' taza(s)'},
    {Name: 'Cucharadas', Short: ' cucharada(s)'},
];

export const Dificultades: string[] = [
    'Principiante',
    'Fácil',
    'Intermedio',
    'Difícil',
    'Avanzado',
    'Experto',
];

export const DifficultyColors: string[] = [
    '#00BCD4',
    '#4CAF50',
    '#8BC34A',
    '#D0E000',
    '#FF9800',
    '#FF5722',
    '#DF1A1A',
    '#FF0000',    
];