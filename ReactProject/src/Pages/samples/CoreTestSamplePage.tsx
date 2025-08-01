import React, { useState } from 'react';
import { pol } from '../../utils/pol'; 

interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    registered: string;
    age: number;
    tags: string[];
    address: {
        street: string;
        city: string;
        zip: string;
    };
    getDisplayName(): string; 
}

const users: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', isActive: true, registered: '2022-03-20 14:30:00', age: 30, tags: ['frontend', 'react'], address: { street: '123 Main St', city: 'New York', zip: '10001' }, getDisplayName: function() { return `${this.name} (${this.age})`; } },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', isActive: false, registered: '2022-03-20 14:30:00', age: 24, tags: ['backend', 'node'], address: { street: '456 Oak Ave', city: 'Los Angeles', zip: '90001' }, getDisplayName: function() { return `${this.name} (${this.age})`; } },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', isActive: true, registered: '2023-01-15 11:00:00', age: 35, tags: ['devops', 'aws'], address: { street: '789 Pine Ln', city: 'Chicago', zip: '60601' }, getDisplayName: function() { return `${this.name} (${this.age})`; } },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', isActive: true, registered: '2024-05-01 09:00:00', age: 28, tags: ['frontend', 'vue'], address: { street: '101 Elm Rd', city: 'New York', zip: '10002' }, getDisplayName: function() { return `${this.name} (${this.age})`; } },
    { id: 5, name: 'Eve Adams', email: 'eve@example.com', isActive: false, registered: '2023-08-10 16:00:00', age: 30, tags: ['backend', 'python'], address: { street: '202 Birch Blvd', city: 'Chicago', zip: '60602' }, getDisplayName: function() { return `${this.name} (${this.age})`; } },
    { id: 6, name: 'Frank White', email: 'frank@example.com', isActive: true, registered: '2022-11-05 08:00:00', age: 40, tags: ['fullstack', 'js'], address: { street: '303 Cedar Ct', city: 'Los Angeles', zip: '90002' }, getDisplayName: function() { return `${this.name} (${this.age})`; } },
];

function PolUtilsDemo() {

    // Ejemplos de Cadenas
    const [leftPadResult, setLeftPadResult] = useState('');
    const [formatStringResult, setFormatStringResult] = useState('');
    const [replaceAllResult, setReplaceAllResult] = useState('');
    const [fixDateResult, setFixDateResult] = useState('');
    const [htmlDecodeResult, setHtmlDecodeResult] = useState('');
    const [trimValuesResult, setTrimValuesResult] = useState<string[]>([]);
    const [splitStringResult, setSplitStringResult] = useState<string[]>([]);
    const [stringMergeResult, setStringMergeResult] = useState('');

    // Ejemplos de Arrays
    const [filteredUsersByFn, setFilteredUsersByFn] = useState<User[]>([]);
    const [filteredUsersByObj, setFilteredUsersByObj] = useState<User[]>([]);
    const [filteredUsersByRegex, setFilteredUsersByRegex] = useState<User[]>([]);
    const [filteredUsersByComputedProp, setFilteredUsersByComputedProp] = useState<User[]>([]);

    const [sortedUsersByName, setSortedUsersByName] = useState<User[]>([]);
    const [sortedUsersByFn, setSortedUsersByFn] = useState<User[]>([]);
    const [sortedUsersMultipleCriteria, setSortedUsersMultipleCriteria] = useState<User[]>([]);

    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [lastUser, setLastUser] = useState<User | undefined>(undefined);
    const [distinctAges, setDistinctAges] = useState<number[]>([]);
    const [groupedUsers, setGroupedUsers] = useState<Record<string, User[]>>({});
    const [sumOfAges, setSumOfAges] = useState<number>(0);
    const [usersDictionary, setUsersDictionary] = useState<Record<string, User | any>>({});
    const [chunkedUsers, setChunkedUsers] = useState<User[][]>([]);
    

    const runStringExamples = () => {
        setLeftPadResult(pol.str('42').leftPad(5, '0').value());
        setFormatStringResult(pol.str('Hola, {0}! Hoy es {1}.').format('Mundo', 'Jueves').value());
        setReplaceAllResult(pol.str('uno dos uno').replaceAll('uno', 'tres').value());
        setFixDateResult(pol.str('2023-10-26 15:30:00').fixDate().value());
        setHtmlDecodeResult(pol.str('&lt;div&gt;Hola &amp; Mundo&lt;/div&gt;').htmlDecode().value() || '');
        setTrimValuesResult(pol.str(' manzana , naranja , platano ').trimValues().value());
        setSplitStringResult(pol.str('manzana,platano,naranja').split(',').value());
        setStringMergeResult(pol.str('Usuario: {name}, Email: {email}, Mostrar: {getDisplayName}').merge(users[0]).value());
    };

    const runArrayExamples = () => {
       
        // --- Ejemplos para WHERE ---
        // 1. Where usando una función
        setFilteredUsersByFn(pol.arr(users).where((item:User) => item.age > 25 && item.isActive).value());

        // 2. Where usando un objeto con coincidencias exactas
        setFilteredUsersByObj(pol.arr(users).where({ isActive: true, 'address.city': 'New York' }).value());

        // 3. Where usando un objeto con RegExp
        setFilteredUsersByRegex(pol.arr(users).where({ email: /\.com$/ }).value()); // Correos terminados en .com

        // 4. Where usando un objeto con una propiedad computada (función en el item)
        setFilteredUsersByComputedProp(pol.arr(users).where({ getDisplayName: (val: string) => val.includes('Alice') }).value());
        
        // --- Ejemplos para SORT BY ---
        // 1. Sort by una propiedad simple
        setSortedUsersByName(pol.arr([...users]).sortBy('name', 'asc').value());

        // 2. Sort by una función (ej. por longitud del nombre)
        setSortedUsersByFn(pol.arr([...users]).sortBy((item:User) => item.email.length, 'desc').value());

        // 3. Sort by múltiples criterios (usando funciones y propiedades)
        setSortedUsersMultipleCriteria(pol.arr([...users]).sortBy([
            { key: (item:User) => item.address.city, direction: 'asc' }, // Primero por ciudad
            { key: 'age', direction: 'desc' },                     // Luego por edad descendente
            { key: 'name', direction: 'asc' }                      // Finalmente por nombre ascendente
        ]).value());

        // Otros Métodos de Array (existente)
        setSelectedEmails(pol.arr(users).select((user:User) => user.email).value());
        setLastUser(pol.arr(users).lastItem());
        setDistinctAges(pol.arr(users).distinct((user:User) => user.age).value());
        setGroupedUsers(pol.arr(users).groupBy('registered'));
        setSumOfAges(pol.arr(users).sum('age'));
        setUsersDictionary(pol.arr(users).toDictionary('id', 'email'));
        setChunkedUsers(pol.arr(users).split(2).value());
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Demo de PolUtils</h1>
            <p>Este componente demuestra el uso de las utilidades de `PolUtils` para manipulación de cadenas y arrays.</p>
            <hr />

            <h2>Ejemplos de Cadenas</h2>
            <button onClick={runStringExamples}>Ejecutar Ejemplos de Cadenas</button>
            <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}>
                <p><strong>`stringLeftPad('42', 5, '0')`:</strong> {leftPadResult}</p>
                <p><strong>`formatString('Hola, {0}! Hoy es {1}.', 'Mundo', 'Jueves')`:</strong> {formatStringResult}</p>
                <p><strong>`stringReplaceAll('uno dos uno', 'uno', 'tres')`:</strong> {replaceAllResult}</p>
                <p><strong>`stringFixDate('2023-10-26 15:30:00')`:</strong> {fixDateResult}</p>
                <p><strong>`stringHtmlDecode('&lt;div&gt;Hola &amp; Mundo&lt;/div&gt;')`:</strong> {htmlDecodeResult}</p>
                <p><strong>`' manzana , naranja    ,   platano    '.trimValues()`:</strong> [{trimValuesResult.join(', ')}]</p>
                <p><strong>`'manzana,platano,naranja'.split(',')`:</strong> [{splitStringResult.join(', ')}]</p>
            </div>
            <hr />

            <h2>Ejemplos de Arrays</h2>
            <button onClick={runArrayExamples}>Ejecutar Ejemplos de Arrays</button>
            <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>`arrayWhere` con función: Usuarios activos y mayores de 25</h3>
                <pre>{JSON.stringify(filteredUsersByFn, null, 2)}</pre>

                <h3>`arrayWhere` con objeto: Usuarios activos en "New York"</h3>
                <pre>{JSON.stringify(filteredUsersByObj, null, 2)}</pre>

                <h3>`arrayWhere` con RegExp: Correos terminados en `.com`</h3>
                <pre>{JSON.stringify(filteredUsersByRegex, null, 2)}</pre>

                <h3>`arrayWhere` con propiedad computada: Usuarios cuyo `getDisplayName` incluye "Alice"</h3>
                <pre>{JSON.stringify(filteredUsersByComputedProp, null, 2)}</pre>

                <h3>`sortBy` por propiedad simple: Usuarios ordenados por nombre (ascendente)</h3>
                <pre>{JSON.stringify(sortedUsersByName, null, 2)}</pre>
                
                <h3>`sortBy` por función: Usuarios ordenados por longitud del email (descendente)</h3>
                <pre>{JSON.stringify(sortedUsersByFn, null, 2)}</pre>

                <h3>`sortBy` múltiples criterios: Por ciudad (asc), luego edad (desc), luego nombre (asc)</h3>
                <pre>{JSON.stringify(sortedUsersMultipleCriteria, null, 2)}</pre>

                {/* Otros ejemplos existentes */}
                <h3>`arraySelect`: Correos electrónicos de usuarios</h3>
                <pre>{JSON.stringify(selectedEmails, null, 2)}</pre>

                <h3>`arrayLastItem`: Último usuario</h3>
                <pre>{JSON.stringify(lastUser, null, 2)}</pre>

                <h3>`arrayDistinct`: Edades únicas</h3>
                <pre>{JSON.stringify(distinctAges, null, 2)}</pre>

                <h3>`arrayGroupBy`: Usuarios agrupados por fecha de registro (solo la parte de la fecha)</h3>
                <pre>{JSON.stringify(groupedUsers, null, 2)}</pre>

                <h3>`arraySum`: Suma de las edades de los usuarios</h3>
                <pre>{sumOfAges}</pre>

                <h3>`arrayToDictionary`: Usuarios por ID y correo electrónico</h3>
                <pre>{JSON.stringify(usersDictionary, null, 2)}</pre>

                <h3>`arraySplit`: Usuarios divididos en grupos de 2</h3>
                <pre>{JSON.stringify(chunkedUsers, null, 2)}</pre>
            </div>
        </div>
    );
}

export default PolUtilsDemo;