import React, { useEffect, useRef } from 'react';

import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';

import { keymap } from 'prosemirror-keymap';
import { undo, redo, history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';

import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { menuBar } from 'prosemirror-menu';

import { buildKeymap } from './keymap';
import { buildMenuItems } from './menu';
import { buildInputRules } from './inputrules';

const reactPropsKey = new PluginKey('reactProps');

const ReactProps = (initialProps: any) => {
  return new Plugin({
    key: reactPropsKey,
    state: {
      // init: () => initialProps,
      init: () => {
        return DecorationSet.empty;
      },
      // apply: (tr, prev) => tr.getMeta(reactPropsKey) || prev,
      apply: (tr, set) => {
        // Adjust decoration positions to changes made by the transaction
        set = set.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        let action = tr.getMeta(reactPropsKey);
        if (action && action.add) {
          let widget = document.createElement('placeholder');
          let deco = Decoration.widget(action.add.pos, widget, {
            id: action.add.id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action && action.remove) {
          set = set.remove(
            set.find(null, null, (spec: any) => spec.id == action.remove.id)
          );
        }

        return set;
      },
    },
    props: {
      decorations(state: any) {
        let doc = state.doc;
        if (
          doc.childCount == 1 &&
          doc.firstChild.isTextblock &&
          doc.firstChild.content.size == 0
        ) {
          var container = document.createElement('span');
          const newNode = document.createTextNode('상품 상세를 입력하세요...');

          container.appendChild(newNode);
          container.style.color = '#a0aec0';

          return DecorationSet.create(doc, [Decoration.widget(1, container)]);
        }
      },
    },
  });
};

const Editor = (props: any) => {
  const viewHost: any = useRef();
  const view: any = useRef(null);

  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(
        schema.spec.nodes as any,
        'paragraph block*',
        'block'
      ),
      marks: schema.spec.marks,
    });

    const plugins = [
      ReactProps(props),
      buildInputRules(mySchema),
      history(),
      keymap(buildKeymap(mySchema, { 'Mod-z': undo, 'Mod-y': redo })),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      menuBar({ floating: false, content: buildMenuItems(mySchema).fullMenu }),
    ];
    // initial render
    const state = EditorState.create({
      schema: mySchema,
      plugins,
    });
    view.current = new EditorView(viewHost.current, { state });
    return () => view.current.destroy();
  }, []);

  useEffect(() => {
    // every render
    const tr = view.current.state.tr.setMeta(reactPropsKey, props);
    view.current.dispatch(tr);
  });

  return (
    <>
      <style global jsx>{`
        .ProseMirror {
          position: relative;
        }

        .ProseMirror {
          word-wrap: break-word;
          white-space: pre-wrap;
          white-space: break-spaces;
          -webkit-font-variant-ligatures: none;
          font-variant-ligatures: none;
          font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
        }

        .ProseMirror pre {
          white-space: pre-wrap;
        }

        .ProseMirror li {
          position: relative;
        }

        .ProseMirror-hideselection *::selection {
          background: transparent;
        }
        .ProseMirror-hideselection *::-moz-selection {
          background: transparent;
        }
        .ProseMirror-hideselection {
          caret-color: transparent;
        }

        .ProseMirror-selectednode {
          outline: 2px solid #8cf;
        }

        /* Make sure li selections wrap around markers */

        li.ProseMirror-selectednode {
          outline: none;
        }

        li.ProseMirror-selectednode:after {
          content: '';
          position: absolute;
          left: -32px;
          right: -2px;
          top: -2px;
          bottom: -2px;
          border: 2px solid #8cf;
          pointer-events: none;
        }
        .ProseMirror-textblock-dropdown {
          min-width: 3em;
        }

        .ProseMirror-menu {
          margin: 0 -4px;
          line-height: 1;
        }

        .ProseMirror-tooltip .ProseMirror-menu {
          width: -webkit-fit-content;
          width: fit-content;
          white-space: pre;
        }

        .ProseMirror-menuitem {
          margin-right: 3px;
          display: inline-block;
        }

        .ProseMirror-menuseparator {
          border-right: 1px solid #ddd;
          margin-right: 3px;
        }

        .ProseMirror-menu-dropdown,
        .ProseMirror-menu-dropdown-menu {
          font-size: 90%;
          white-space: nowrap;
        }

        .ProseMirror-menu-dropdown {
          vertical-align: 1px;
          cursor: pointer;
          position: relative;
          padding-right: 15px;
        }

        .ProseMirror-menu-dropdown-wrap {
          padding: 1px 0 1px 4px;
          display: inline-block;
          position: relative;
        }

        .ProseMirror-menu-dropdown:after {
          content: '';
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid currentColor;
          opacity: 0.6;
          position: absolute;
          right: 4px;
          top: calc(50% - 2px);
        }

        .ProseMirror-menu-dropdown-menu,
        .ProseMirror-menu-submenu {
          position: absolute;
          background: white;
          color: #666;
          border: 1px solid #aaa;
          padding: 2px;
        }

        .ProseMirror-menu-dropdown-menu {
          z-index: 15;
          min-width: 6em;
        }

        .ProseMirror-menu-dropdown-item {
          cursor: pointer;
          padding: 2px 8px 2px 4px;
        }

        .ProseMirror-menu-dropdown-item:hover {
          background: #f2f2f2;
        }

        .ProseMirror-menu-submenu-wrap {
          position: relative;
          margin-right: -4px;
        }

        .ProseMirror-menu-submenu-label:after {
          content: '';
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid currentColor;
          opacity: 0.6;
          position: absolute;
          right: 4px;
          top: calc(50% - 4px);
        }

        .ProseMirror-menu-submenu {
          display: none;
          min-width: 4em;
          left: 100%;
          top: -3px;
        }

        .ProseMirror-menu-active {
          background: #a0aec0;
          color: white;
          border-radius: 4px;
        }

        .ProseMirror-menu-disabled {
          opacity: 0.3;
        }

        .ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu,
        .ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
          display: block;
        }

        .ProseMirror-menubar {
          border-top-left-radius: inherit;
          border-top-right-radius: inherit;
          position: relative;
          min-height: 1em;
          color: #718096;
          padding: 1px 6px;
          top: 0;
          left: 0;
          right: 0;
          border-bottom: 1px solid #cbd5e0;
          background: white;
          z-index: 10;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          overflow: visible;
        }

        .ProseMirror-icon {
          display: inline-block;
          line-height: 0.8;
          vertical-align: -2px; /* Compensate for padding */
          padding: 2px 8px;
          cursor: pointer;
        }

        .ProseMirror-menu-disabled.ProseMirror-icon {
          cursor: default;
        }

        .ProseMirror-icon svg {
          fill: currentColor;
          height: 1em;
        }

        .ProseMirror-icon span {
          vertical-align: text-top;
        }
        .ProseMirror-gapcursor {
          display: none;
          pointer-events: none;
          position: absolute;
        }

        .ProseMirror-gapcursor:after {
          content: '';
          display: block;
          position: absolute;
          top: -2px;
          width: 20px;
          border-top: 1px solid black;
          animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
        }

        @keyframes ProseMirror-cursor-blink {
          to {
            visibility: hidden;
          }
        }

        .ProseMirror-focused .ProseMirror-gapcursor {
          display: block;
        }
        /* Add space around the hr to make clicking it easier */

        .ProseMirror-example-setup-style hr {
          padding: 2px 10px;
          border: none;
          margin: 1em 0;
        }

        .ProseMirror-example-setup-style hr:after {
          content: '';
          display: block;
          height: 1px;
          background-color: silver;
          line-height: 2px;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 30px;
        }

        .ProseMirror blockquote {
          padding-left: 1em;
          border-left: 3px solid #eee;
          margin-left: 0;
          margin-right: 0;
        }

        .ProseMirror-example-setup-style img {
          cursor: default;
        }

        .ProseMirror-prompt {
          background: white;
          padding: 5px 10px 5px 15px;
          border: 1px solid silver;
          position: fixed;
          border-radius: 3px;
          z-index: 11;
          box-shadow: -0.5px 2px 5px rgba(0, 0, 0, 0.2);
        }

        .ProseMirror-prompt h5 {
          margin: 0;
          font-weight: normal;
          font-size: 100%;
          color: #444;
        }

        .ProseMirror-prompt input[type='text'],
        .ProseMirror-prompt textarea {
          background: #eee;
          border: none;
          outline: none;
        }

        .ProseMirror-prompt input[type='text'] {
          padding: 0 4px;
        }

        .ProseMirror-prompt-close {
          position: absolute;
          left: 2px;
          top: 1px;
          color: #666;
          border: none;
          background: transparent;
          padding: 0;
        }

        .ProseMirror-prompt-close:after {
          content: '✕';
          font-size: 12px;
        }

        .ProseMirror-invalid {
          background: #ffc;
          border: 1px solid #cc7;
          border-radius: 4px;
          padding: 5px 10px;
          position: absolute;
          min-width: 10em;
        }

        .ProseMirror-prompt-buttons {
          margin-top: 5px;
          display: none;
        }
        #editor,
        .editor {
          background: white;
          color: black;
          background-clip: padding-box;
          border-radius: 4px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          padding: 5px 0;
          margin-bottom: 23px;
        }

        .ProseMirror p:first-child,
        .ProseMirror h1:first-child,
        .ProseMirror h2:first-child,
        .ProseMirror h3:first-child,
        .ProseMirror h4:first-child,
        .ProseMirror h5:first-child,
        .ProseMirror h6:first-child {
          margin-top: 10px;
        }

        .ProseMirror {
          padding: 4px 8px 4px 14px;
          line-height: 1.2;
          outline: none;
        }

        .ProseMirror p {
          margin-bottom: 1em;
        }

        .ProseMirror h1 {
          font-size: 32px;
          margin-bottom: 0.8em;
        }

        .ProseMirror h2 {
          font-size: 24px;
          margin-bottom: 0.8em;
        }

        .ProseMirror img {
          width: 100%;
        }

        .ProseMirror a {
          color: rgb(245, 92, 137);
          text-decoration: underline;
        }
      `}</style>
      <div className="font-bold text-gray-600 text-sm">{props.label}</div>
      <div className="rounded-md border border-gray-400 py-2 px-4 w-full">
        <div ref={viewHost} />
      </div>
    </>
  );
};

export default Editor;
