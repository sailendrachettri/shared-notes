import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { CommandsList } from "./CommandsList";

export const SlashCommand = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }) => {
          const items = [
            {
              title: "Text",
              description: "Just start writing with plain text",
              keywords: ["txt", "te", "text"],
              icon: "📝",
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setParagraph().run();
              },
            },
            {
              title: "Heading 1",
              description: "Big section heading",
              keywords: ["h1", "head1", "he1", "heading 1"],
              icon: "H1",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHeading({ level: 1 })
                  .run();
              },
            },
            {
              title: "Heading 2",
              description: "Medium section heading",
              keywords: ["h2", "head2", "he2", "heading 2"],
              icon: "H2",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHeading({ level: 2 })
                  .run();
              },
            },
            {
              title: "Heading 3",
              description: "Small section heading",
              keywords: ["h3", "head3", "he3", "heading 3"],
              icon: "H3",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHeading({ level: 3 })
                  .run();
              },
            },
            {
              title: "Bullet List",
              description: "Create a simple bullet list",
              keywords: ["blis", "bullet list", "bl", "lst", "list"],
              icon: "•",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run();
              },
            },
            {
              title: "Numbered List",
              description: "Create a list with numbering",
              keywords: ["nlis", "number list", "nl", "lst", "list"],
              icon: "1.",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run();
              },
            },
            {
              title: "To-do List",
              description: "Track tasks with a to-do list",
              keywords: ["tdl", "todo", "todo list", "to"],
              icon: "☑",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleTaskList()
                  .run();
              },
            },
            {
              title: "Quote",
              description: "Capture a quote",
              keywords: ["q", "qt", "quote"],
              icon: "",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBlockquote()
                  .run();
              },
            },
            {
              title: "Code Block",
              description: "Capture a code snippet",
              keywords: ["code", "co", "c", "cd"],
              icon: "</>",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleCodeBlock()
                  .run();
              },
            },
            {
              title: "Divider",
              description: "Visually divide blocks",
              keywords: ["d", "div", "divider", "min"],
              icon: "—",
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHorizontalRule()
                  .run();
              },
            },
            // {
            //   title: "Table",
            //   description: "Insert a table",
            //   icon: "⊞",
            //   command: ({ editor, range }) => {
            //     editor
            //       .chain()
            //       .focus()
            //       .deleteRange(range)
            //       .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            //       .run();
            //   },
            // },
          ];

          // Search suggestion based on keywoard
          return items.filter((item) => {
            const q = query.toLowerCase();

            return (
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.keywords?.some((k) => k.toLowerCase().includes(q))
            );
          });
        },
        render: () => {
          let component;
          let popup;

          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },

            onUpdate(props) {
              component.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }

              return component.ref?.onKeyDown(props);
            },

            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});
