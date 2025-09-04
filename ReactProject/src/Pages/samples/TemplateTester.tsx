
import { useCallback, useEffect, useRef, useState } from "react";
import Splitter from "../../components/Splitter/Splitter";
import { pol } from "../../utils/pol";
import { core, formatString } from "../../utils/core";
import { useModal } from "../../hooks/useModal";
import ListControl from "../../components/lists/List";
import PubSub from "../../components/Pubsub";
import { NOTIFICATION_TYPES } from "../../constants/appConfig";

const appConfig = pol.core.config('ReactApp');

interface PropertyObject {
    name: string;
    dbType: string;
    jsType: string;
    dbName: string;
}

function translateTemplate(templateString: string) {
    const startRegex = /\{foreach\s+(\w+)\s+in\s+(\w+)\}/g;
    const endRegex = /\{endforeach\}/g;
    const translatedStart = templateString.replace(startRegex, (match, item, items) => {
        return `\$\{${items}.map(${item} => \``;
    });
    const translatedEnd = translatedStart.replace(endRegex, '`).join(\'\')\}');
    return translatedEnd;
}

function renderCustomTemplate(templateWithCustomSyntax: string, context: any) {
    const translatedTemplate = translateTemplate(templateWithCustomSyntax);
    const keys = Object.keys(context);
    const values = Object.values(context);
    const dynamicFunction = new Function(...keys, `return \`${translatedTemplate}\``);
    return dynamicFunction(...values);
}

function processXmlToObject(xml: string): { result: string, data: any } {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) return {
        result: 'error',
        data: parseError.textContent
    };

    const entityElement = xmlDoc.querySelector('Entity');
    if (!entityElement) return {
        result: 'error',
        data: 'XML does not contain an <Entity> element.'
    };

    const getJsType = (dbType: string) => {
        switch (dbType.toLowerCase()) {
            case 'long':
            case 'int':
                return 'number';
            case 'datetime':
                return 'Date';
            case 'boolean':
                return 'boolean';
            default:
                return 'string';
        }
    };

    const entityObject = {
        itemName: entityElement.getAttribute('itemName'),
        collectionName: entityElement.getAttribute('collectionName'),
        tableName: entityElement.getAttribute('tableName'),
        properties: new Array<PropertyObject>()
    };

    const properties = entityElement.querySelectorAll('Bindables > Property');

    properties.forEach(prop => {
        const dbType = prop.getAttribute('dbType') || '';
        const propObject: PropertyObject = {
            name: prop.getAttribute('name') || '',
            dbType: dbType,
            jsType: getJsType(dbType),
            dbName: prop.getAttribute('dbName') || '',
        };
        entityObject.properties.push(propObject);
    });

    return { result: 'ok', data: entityObject };
}

const DOCS_KEY = 'template-tester.documents.';
const SAMPLE_XML =
    `<Entity itemName="Distribuidor" collectionName="Distribuidores" tableName="[Distribuidor]">
  <Properties>
    <Bindables>
      <Property name="Id" dbType="long" dbName="Id" maxlength="4" toString="S" />
      <Property name="Nif" dbType="string" dbName="Nif" maxlength="15" toString="S" />
      <Property name="Nombre" dbType="string" dbName="Nombre" maxlength="100" toString="S" />
      <Property name="Email" dbType="string" dbName="Email" maxlength="100" toString="S" />
      <Property name="Direccion" dbType="string" dbName="Direccion" maxlength="200" toString="S" />
      <Property name="Ciudad" dbType="string" dbName="Ciudad" maxlength="50" toString="S" />
      <Property name="PaisId" dbType="int" dbName="PaisId" maxlength="4" toString="S" />
      <Property name="Telefono" dbType="string" dbName="Telefono" maxlength="20" toString="S" />
      <Property name="CategoriaProductoId" dbType="int" dbName="CategoriaProductoId" maxlength="4" toString="S" />
      <Property name="TipoDocumentoId" dbType="int" dbName="TipoDocumentoId" maxlength="4" toString="S" />
      <Property name="TipoTransaccionId" dbType="int" dbName="TipoTransaccionId" maxlength="4" toString="S" />
      <Property name="MonedaId" dbType="int" dbName="MonedaId" maxlength="4" toString="S" />
      <Property name="Activo" dbType="int" dbName="Activo" maxlength="4" toString="S" />
      <Property name="FechaAlta" dbType="DateTime" dbName="FechaAlta" maxlength="16" toString="S" />
    </Bindables>
    <NoBindables />
  </Properties>
</Entity>`;

const TemplateTester = () => {

    const [fontSize, setFontSize] = useState(12);
    const [filename, setFilename] = useState('Sin nombre');
    const [template, setTemplate] = useState('');
    const [contextJs, setContextJs] = useState('{}');
    const [result, setResult] = useState('');
    const [jsError, setJsError] = useState('');
    const { showModal, closeModal } = useModal();

    const xmlTextareaRef = useRef<HTMLTextAreaElement>(null);
    const cursorPositionRef = useRef(null);
    const deleteProjectBtnRef = useRef<HTMLButtonElement>(null);
    const openProjectBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        console.log('TemplateTester.useEffect');
    });

    useEffect(() => {
        console.log('TemplateTester.useEffect: []');
        var context = appConfig.read('template-tester.context');
        var template = appConfig.read('template-tester.template');
        if (context) setContextJs(context);
        if (template) setTemplate(template);
    }, []);

    useEffect(() => {
        console.log('TemplateTester.useEffect: [template, contextJs]');
        try {

            const context = new Function(
                formatString('return {0};', contextJs)
            )();
            Object.assign(context, { core: core });
            const result = renderCustomTemplate(template, context);
            setJsError('');
            setResult(result);

            appConfig.write('template-tester.context', contextJs);
            appConfig.write('template-tester.template', template);

        } catch (e: any) {
            setJsError(e.message);
            setResult('');
        }
        if (cursorPositionRef.current !== null) {
            const activeTextarea = document.activeElement as any;
            if (activeTextarea && activeTextarea.tagName === 'TEXTAREA') {
                activeTextarea.selectionStart = cursorPositionRef.current;
                activeTextarea.selectionEnd = cursorPositionRef.current;
            }
            cursorPositionRef.current = null;
        }
    }, [template, contextJs]);

    const save = () => {
        const doc = {
            context: contextJs,
            template,
            fontSize
        };
        const name = filename.trim() || 'noname';
        const key = formatString('{0}{1}', DOCS_KEY, name);
        appConfig.write(
            key,
            JSON.stringify(doc)
        );
        PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
            message: <div className="w3-padding">Proyecto <b>{name}</b> guardado correctamente.</div>,
            type: NOTIFICATION_TYPES.TEXT,
            duration: 2000
        });
    }

    const showOpenProjectDialog = (names: string[]) => {

        if (!names || !names.length) return;

        let target: { name: string, id: string } | null = null;
        const resolver = { text: 'name', id: 'id' };
        const datasource = names.map(n => {
            return {
                name: pol.arr(n.split(DOCS_KEY)).lastItem() || '',
                id: n
            }
        });

        const onSelect = (keys: string[]) => {
            target = null;
            if (keys.length)
                target = pol.arr(datasource).item('id', keys[0]) || null;
            if (deleteProjectBtnRef.current)
                deleteProjectBtnRef.current.disabled = target == null;
            if (openProjectBtnRef.current)
                openProjectBtnRef.current.disabled = target == null;
        }

        const openProject = () => {
            alert('openProject');
            //if (target) {
            //    const data = appConfig.read(target.id);
            //    setFilename(target.name);
            //    const doc = data ? JSON.parse(data) : { context: '', template: '' };
            //    if (doc && doc.context) setContextJs(doc.context)
            //    if (doc && doc.template) setTemplate(doc.template)
            //    if (doc && doc.fontSize) setFontSize(doc.fontSize)
            //    closeModal();
            //}
        }

        const deleteProject = () => {
            alert('deleteProject');
            //if (target) {
            //    appConfig.remove(target.id);
            //    closeModal();
            //    loadProjects();
            //}
        }

        showModal({
            title: 'Abrir proyecto',
            content: (
                <div>
                    <p>Selecciona un proyecto:</p>
                    <ListControl<any>
                        dataSource={datasource}
                        resolver={resolver}
                        onSelect={onSelect}
                        listHeight="200px"
                        value={[]}
                        multiSelect={false}
                    />
                </div>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={deleteProject} ref={deleteProjectBtnRef}>Eliminar</button>,
                <button className="w3-button w3-gray" onClick={openProject} ref={openProjectBtnRef}>Abrir</button>,
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>
            ],
            beforeClose: () => {
                return true;
            },
            allowManualClose: false
        });
        setTimeout(() => onSelect([]), 0);
    };

    const loadProjects = () => {
        showOpenProjectDialog(
            Object.keys(appConfig.readAll())
                .filter(k => k.indexOf(DOCS_KEY) == 0)
        );
    }

    const loadXml = () => {

        const importXml = () => {
            try {
                const xml = xmlTextareaRef.current ? xmlTextareaRef.current.value : '';
                const result = processXmlToObject(xml);
                if (result.result == 'ok') {
                    let json = JSON.stringify(result.data, null, 2);
                    json = json.replace(/"([^"]+)":/g, '$1:');
                    json = json.replace(/$  /g, '');
                    json = formatString('{0}', json);
                    setContextJs(json);
                    closeModal();
                    return;
                }
                setJsError(result.data);
            } catch (e: any) {
                setJsError(e.message);
            }
        }

        showModal({
            title: 'Importar XML',
            content: (
                <div>
                    <p>Introduce el contenido xml de PolCodGenerator</p>
                    <textarea
                        className="w3-input"
                        spellCheck="false"
                        ref={xmlTextareaRef}
                        defaultValue={SAMPLE_XML}
                        placeholder="Escribe aquí el xml"
                        rows={12}
                        style={{
                            fontFamily: 'monospace',
                            fontSize: '13px',
                            backgroundColor: 'whiteSmoke',
                            resize: 'none',
                            padding: '8px',
                            outline: 'none',
                            border: 'solid 1px silver'
                        }}
                    ></textarea>
                </div>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={importXml}>Importar</button>,
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>
            ],
            beforeClose: () => {
                return true;
            },
            allowManualClose: false
        });
    }

    const downloadResult = () => {

        const a = document.createElement('a');
        document.body.appendChild(a);
        a.download = filename.toLowerCase().endsWith('.txt') ? filename : formatString('{0}.txt', filename);
        a.href = URL.createObjectURL(
            new Blob([result], { type: 'text/plain' })
        );
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };

    const copyResult = () => {
        navigator.clipboard.writeText(result)
            .then(() => {
                PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
                    message: <div className="w3-padding">Proyecto <b>{filename}</b> copiado correctamente.</div>,
                    type: NOTIFICATION_TYPES.TEXT,
                    duration: 2000
                });
            })
            .catch(err => {
                console.error("Error al copiar al portapapeles:", err);
            });
    };

    const handleTabKeyDown = (event: any, setState: any) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const textarea = event.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const spaces = '  ';
            cursorPositionRef.current = start + spaces.length;
            setState((prevValue: string) =>
                prevValue.substring(0, start) + spaces + prevValue.substring(end)
            );
        }
    };

    return (
        <>
            <div className="flex-container">
                <div className="flex-items">
                    <div className="w3-white w3-border">
                        <button className="w3-button" onClick={() => save()}>
                            <i className="w3-large fa fa-save"></i>
                        </button>
                        <button className="w3-button" onClick={() => loadProjects()}>
                            <i className="w3-large fa fa-upload"></i>
                        </button>
                        <button className="w3-button" onClick={() => loadXml()}>
                            <i className="w3-large fa fa-file-text-o"></i>
                        </button>
                        <span> </span>Proyecto: <input
                            type="text"
                            spellCheck={false}
                            className="w3-input w3-border-0 w3-light-grey"
                            style={{ width: '20%', display: 'inline-block', outline: 'none' }}
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                        >
                        </input>

                        <button className="w3-button w3-right" onClick={() => setFontSize(fontSize + 1)}>
                            <i className="w3-large fa fa-plus"></i>
                        </button>
                        <button className="w3-button w3-right" onClick={() => setFontSize(fontSize - 1)}>
                            <i className="w3-large fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="flex-items">
                    <div className="template-tester-container">
                        <Splitter name="templateTester-context-splitter">
                            <div className="splitter-panel-content">
                                <h6 className="w3-teal w3-padding">JS Context</h6>
                                <textarea
                                    className=""
                                    style={{ fontSize: fontSize + 'px' }}
                                    spellCheck="false"
                                    value={contextJs}
                                    onChange={(e) => setContextJs(e.target.value)}
                                    onKeyDown={(e) => handleTabKeyDown(e, setContextJs)}
                                    placeholder="Escribe aquí el objeto de contexto en formato JavaScript"
                                ></textarea>
                            </div>
                            <Splitter name="templateTester-template-splitter">
                                <div className="splitter-panel-content">
                                    <h6 className="w3-teal w3-padding">Template</h6>
                                    <textarea
                                        className=""
                                        style={{ fontSize: fontSize + 'px' }}
                                        spellCheck="false"
                                        value={template}
                                        onChange={(e) => setTemplate(e.target.value)}
                                        onKeyDown={(e) => handleTabKeyDown(e, setTemplate)}
                                        placeholder="Escribe tu plantilla aquí, por ejemplo: Hola {user.name}"
                                    >
                                    </textarea>
                                </div>
                                <div className="splitter-panel-content">
                                    <h6 className="w3-teal w3-padding">Result
                                        <button className="w3-right pol-h6-button" onClick={() => downloadResult()}>
                                            <i className="fa fa-download"></i>
                                        </button>
                                        <button className="w3-right pol-h6-button" onClick={() => copyResult()}>
                                            <i className="fa fa-copy"></i>
                                        </button>
                                    </h6>
                                    <pre
                                        style={{ fontSize: fontSize + 'px' }}
                                        className=""
                                    >
                                        {result}
                                    </pre>
                                </div>
                            </Splitter>

                        </Splitter>

                    </div>

                </div>
                {jsError && (
                    <div className="w3-red error-panel">
                        <button className="w3-button w3-white w3-right" onClick={() => setJsError('')}>
                            <i className="w3-large fa fa-close"></i>
                        </button>
                        <p>{jsError}</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default TemplateTester;