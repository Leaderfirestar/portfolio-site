import { RichTextNode } from '@/lib/defintions';
import React from 'react';

interface RichTextRendererProps {
	nodes: RichTextNode[];
}

function RichTextRenderer({ nodes }: RichTextRendererProps) {
	function renderNode(node: RichTextNode, key: React.Key): React.ReactNode {
		switch (node.type) {
			case 'heading':
				const HeadingTag = `h${node.level}` as keyof JSX.IntrinsicElements;
				return <HeadingTag key={key}>{renderNodes(node.children)}</HeadingTag>;
			case 'paragraph':
				return <p key={key}>{renderNodes(node.children)}</p>;
			case 'list':
				const ListTag = node.format === 'ordered' ? 'ol' : 'ul';
				return <ListTag key={key}>{renderNodes(node.children)}</ListTag>;
			case 'list-item':
				return <li key={key} >{renderNodes(node.children)}</li>;
			case 'text':
				const style: React.CSSProperties = {};
				if (node.bold) style.fontWeight = "800";
				if (node.italic) style.fontStyle = "italic";
				return <span key={key} style={style}>{node.text}</span>;
			default:
				return null;
		}
	}

	function renderNodes(nodes?: RichTextNode[]): React.ReactNode {
		if (!nodes) return null;
		return nodes.map((node, index) => renderNode(node, index));
	}

	return <>{renderNodes(nodes)}</>;
}

export default RichTextRenderer;