import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export const CommandsList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="slash-commands-menu">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`slash-command-item ${
              index === selectedIndex ? "is-selected" : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="slash-command-icon">{item.icon}</div>
            <div className="slash-command-content">
              <div className="slash-command-title">{item.title}</div>
              <div className="slash-command-description">
                {item.description}
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="slash-command-item">No results</div>
      )}
    </div>
  );
});

CommandsList.displayName = "CommandsList";