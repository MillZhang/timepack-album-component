import md5 from 'md5';
export default new class AlbumCache {
  encode(value) {
    let uid = this.user().getter();
    return md5(uid + ':' + value);
  }

  appId() {
    let key = this.encode('album-business-appid');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      getByIndex(index) {
        return this.getter()[index];
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json))
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  photoList() {
    let key = this.encode('photoList');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      getByIndex(index) {
        return this.getter()[index];
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json))
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  calendar() {
    let key = this.encode('calendar-list');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      getByIndex(index) {
        return this.getter()[index];
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json))
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  tempPhoto() {
    const key = this.encode('temp-photo');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json));
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  groupPhoto() {
    const key = this.encode('group-photo');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json));
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  layout() {
    const key = this.encode('layout');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json));
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  pageSize() {
    const key = this.encode('pageSize');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json));
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  template() {
    const key = this.encode('templateType');
    return {
      getter() {
        return localStorage.getItem(key);
      },
      setter(json) {
        localStorage.setItem(key, json);
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  user() {
    const key = md5('uid');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json));
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  templateLayout() {
    const key = md5('template-layout');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json));
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  temporary() {
    const key = md5('temporary-id');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json));
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  ticket() {
    let key = md5('album-ticket');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json))
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  mallTicket() {
    let key = md5('mall-ticket');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json))
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }

  appId() {
    let key = md5('album-appId');
    return {
      getter() {
        return JSON.parse(localStorage.getItem(key));
      },
      setter(json) {
        localStorage.setItem(key, JSON.stringify(json))
        return this;
      },
      remove() {
        localStorage.removeItem(key);
        return this;
      }
    }
  }
  remove() {
    let ticket = this.ticket().getter();
    localStorage.clear();
    this.ticket().setter(ticket);
  }
}
