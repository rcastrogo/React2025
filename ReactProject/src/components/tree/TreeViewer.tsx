import React from 'react';
import { pol } from '../../utils/pol';

interface TreeViewerNode {
    [key: string]: any;
    rows?: any[];
}

interface TreeViewerControlNode {
    name: string;
    parent?: TreeViewerControlNode;
    deep: number;
    rows?: any[];
    children?: { name: string; value: TreeViewerNode; }[];
}

interface TreeViewerLeafNode extends TreeViewerControlNode {
    rows: any[];
}

interface TreeViewerControlProps {
    tree: TreeViewerNode;
    nodeContent: (node: TreeViewerControlNode) => React.ReactNode;
    leafContent: (leaf: TreeViewerLeafNode) => React.ReactNode;
}

function VisitNode({
    node,
    nodeName,
    parent,
    depth,
    nodeContent,
    leafContent
}: {
    node: TreeViewerNode;
    nodeName: string;
    parent?: TreeViewerControlNode;
    depth: number;
    nodeContent: (node: TreeViewerControlNode) => React.ReactNode;
    leafContent: (leaf: TreeViewerLeafNode) => React.ReactNode;
}) {
    const theNode: TreeViewerControlNode = {
        name: nodeName,
        parent: parent,
        deep: depth,
        rows: pol.core.isArray(node)
            ? [...node]
            : node.rows,
        children: pol.core.isArray(node)
            ? []
            : Object.keys(node)
                .filter((property: string) => property !== 'rows')
                .sort()
                .map(g => ({ name: g, value: node[g] }))
    };

    if (theNode.rows) {
        return (
            <React.Fragment key={nodeName}>
                {leafContent(theNode as TreeViewerLeafNode)}
            </React.Fragment>
        );
    }

    return (
        <div key={nodeName} data-key={'G' + theNode.deep}>
            {nodeContent(theNode)}
            {theNode.children && theNode.children.length > 0 && (
                <>
                    {theNode.children.map(child => (
                        <VisitNode
                            key={child.name}
                            node={child.value}
                            nodeName={child.name}
                            parent={theNode}
                            depth={depth + 1}
                            nodeContent={nodeContent}
                            leafContent={leafContent}
                        />
                    ))}
                </>
            )}
        </div>
    );

}

function TreeViewerControl({ tree, nodeContent, leafContent }: TreeViewerControlProps) {
    return (
        <div className="tree-renderer">
            <VisitNode
                node={tree}
                nodeName="root"
                depth={0}
                nodeContent={nodeContent}
                leafContent={leafContent}
            />
        </div>
    );
}

export default TreeViewerControl;